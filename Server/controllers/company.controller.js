import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/fileUpload.js";
import AppError from "../utils/AppError.js";

export const registerCompany = async (req, res, next) => {
  try {
    const { name, description, website, location } = req.body;
    const files = req.files;

    if (!name) {
      return next(new AppError("Company name is required.", 400));
    }

    let company = await Company.findOne({ name });
    if (company) {
      return next(new AppError("You can't register same company.", 400));
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
      success: true,
      message: "Company registered successfully.",
      data: company,
    });
  } catch (error) {
    return next(
      new AppError(
        error.message || "Something went wrong while registering the company.",
        500
      )
    );
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return next(new AppError("Companies not found.", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: { companies },
    });
  } catch (error) {
    return next(new AppError(error.message || "Error fetching companies.", 500));
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return next(new AppError("Company not found.", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Company fetched successfully.",
      data: company,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error fetching company by ID.", 500)
    );
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return next(new AppError("Company not found.", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Company information updated.",
      data: company,
    });
  } catch (error) {
    return next(new AppError(error.message || "Error updating company.", 500));
  }
};
