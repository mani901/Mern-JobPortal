import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already registered",
                success: false
            });
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
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profile: newUser.profile
            },
            success: true
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(400).json({
            message: "Something went wrong",
            success: false
        });
    }
};

//login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        //console.log(email)
        let user = await User.findOne({ email }).populate('companies');
        if (!user) {
            return res.status(400).json({
                message: "invalid Credentials",
                success: "false"
            })
        }
        const IsLogin = await bcrypt.compare(password, user.password);
        if (!IsLogin) {
            return res.status(400).json({
                message: "invalid Credentials",
                success: "false"
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with this role",
                success: "false"
            })
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
            message: `Welcome back ${user.fullname}`,
            success: "true",
            user: userResponse
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({

            message: "Something went wrong",
            success: false
        })
    }
}

export const logOut = async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(404).json({
                message: "user Already logout"
            })
        }
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User Logged Out Successfully",
            success: true
        })
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false
        })
    }
}


export const getProfile = async (req, res) => {
    try {
        const userId = req.id; // From isAuthenticated middleware
        
        const user = await User.findById(userId).populate('companies').select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: "false"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            success: "true",
            user: {
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
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: "false"
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body
        const file = req.file


        //cloudinary file handling
        //resume handling
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userid = req.id;
        let user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false
            })
        }
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;


        //resume setup later
        user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "user updated successfully",
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
