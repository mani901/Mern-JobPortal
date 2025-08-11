import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/fileUpload.js";
import AppError from "../utils/AppError.js";
export const register = async (req, res, next) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return next(new AppError("All fields are required", 400));
        }

        const user = await User.findOne({ email });
        if (user) {
            return next(new AppError("Email already registered", 400));
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profile: newUser.profile
            }
        });
    } catch (error) {
        return next(new AppError(error.message || "Something went wrong", 400));
    }
};

//login
export const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        //console.log(email)
        let user = await User.findOne({ email }).populate('companies');
        if (!user) {
            return next(new AppError("invalid Credentials", 400));
        }
        const IsLogin = await bcrypt.compare(password, user.password);
        if (!IsLogin) {
            return next(new AppError("invalid Credentials", 400));
        }
        if (role !== user.role) {
            return next(new AppError("Account does not exist with this role", 400));
        }

        const tokenData = {
            userid: user._id,
            company: user.companies.map(c => c.name)
        }
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            companies: user.companies
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' }).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            data: userResponse
        })
    } catch (error) {
        return next(new AppError(error.message || "Something went wrong", 400));
    }
}

export const logOut = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return next(new AppError("user Already logout", 404));
        }
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User Logged Out Successfully",
            success: true
        })
    } catch (error) {
        return next(new AppError(error.message || "Something went wrong", 400));
    }
}


export const getProfile = async (req, res, next) => {
    try {
        const userId = req.id; 
        
        const user = await User.findById(userId).populate('companies').select("-password");
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
                companies: user.companies
            }
        });
    } catch (error) {
        return next(new AppError(error.message || "Something went wrong", 500));
    }
};



export const updateProfile = async (req, res, next) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const files = req.files;
      

        const userid = req.id;
        let user = await User.findById(userid);

        if (!user) {
            return next(new AppError("User Not Found", 404));
        }

        // Update text fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills;

        // Handle profile photo upload
        if (files && files.profilePhoto) {
            console.log("Uploading profile...")
            const profilePhoto = files.profilePhoto[0];
           if (user.profile.profilePhoto &&user.profile.profilePhoto.public_id) {
  await deleteFromCloudinary(user.profile.profilePhoto.public_id);
}

            const result = await uploadToCloudinary(profilePhoto.buffer, "profile_photos");
            user.profile.profilePhoto = {
                public_id: result.public_id,
                url: result.url
            };
            console.log("Uploaded result: " , result)
        }

        // Handle resume upload
        if (files && files.resume) {
            const resume = files.resume[0];
            if (user.profile.resume && user.profile.resume.url) {
                await deleteFromCloudinary(user.profile.resume.public_id);
            }
            const result = await uploadToCloudinary(resume.buffer, "resumes");
            user.profile.resume = {
                public_id: result.public_id,
                url: result.url
            };
            user.profile.resumeOriginalName = resume.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        return next(new AppError(error.message || "Something went wrong", 500));
    }
};

export const toggleSaveJob = async (req, res, next) => {
    try {
        const userId = req.id;
        const { jobId } = req.body;

        if (!jobId) {
            return next(new AppError("Job ID is required", 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        const index = user.savedJobs.findIndex(j => j.toString() === jobId);
        if (index === -1) {
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({ success: true, message: "Job saved", data: { saved: true, savedJobs: user.savedJobs } });
        } else {
            user.savedJobs.splice(index, 1);
            await user.save();
            return res.status(200).json({ success: true, message: "Job removed from saved", data: { saved: false, savedJobs: user.savedJobs } });
        }
    } catch (error) {
        return next(new AppError(error.message || "Failed to update saved jobs", 500));
    }
};

export const getSavedJobs = async (req, res, next) => {
    try {
        const user = await User.findById(req.id).populate({ path: 'savedJobs', populate: { path: 'companyId', select: 'name logo' } });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        return res.status(200).json({ success: true, message: "Saved jobs fetched", data: user.savedJobs });
    } catch (error) {
        return next(new AppError(error.message || "Failed to fetch saved jobs", 500));
    }
};
