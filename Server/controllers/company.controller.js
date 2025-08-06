import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/fileUpload.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const files = req.files;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      });
    }

    let logo = null;

    if (files && files.logo) {
      const companyLogoFile = files.logo[0];
      const result = await uploadToCloudinary(companyLogoFile.buffer, "company_logos");
      console.log(result);
      logo = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    company = await Company.create({
      name,
      description,
      website,
      location,
      logo,
      userId: req.id,
    });

    const user = await User.findById(req.id);
    user.companies.push(company._id);
    await user.save();

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message || "Something went wrong while registering the company.",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error fetching companies.",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error fetching company by ID.",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated.",
      company,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error updating company.",
      success: false,
    });
  }
};
