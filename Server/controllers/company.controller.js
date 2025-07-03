import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { name , description , website , location , logo} = req.body;
      
        if (!name) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
            
        }
        let company = await Company.findOne({ name });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name,
            description,
            website,
            location,
            logo,
            userId: req.id
        });

        const user = await User.findById(req.id);
        user.companies.push(company._id);
        await user.save();

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;
        //cloudinary setup
        const updateData = { name, description, website, location };
        const company = Company.findByIdAndUpdate(req.params.id, updateData, { new: true })
        if (!company) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })


    } catch (error) {
        console.log(error);
    }
}

