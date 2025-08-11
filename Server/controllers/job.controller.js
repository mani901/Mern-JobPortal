import { StatusCodes } from 'http-status-codes';
import { Job } from '../models/job.model.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js';

export const createJob = async (req, res, next) => {
    const { title, description, requirements, location, salary, companyId, jobType, position } = req.body;

    const recruiterId = req.user._id;

    if (!companyId) {
        return next(new AppError('Company ID is required', 400));
    }

    try {
        const recruiter = await User.findById(recruiterId);
        if (!recruiter.companies.includes(companyId)) {
            return next(new AppError('You are not authorized to post jobs for this company', 403));
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return next(new AppError('Company not found', 404));
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            location,
            salary,
            companyId,
            jobType,
            position,
            createdBy: recruiterId
        });


        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });
    } catch (error) {
        logger.error('Error creating job:', error);
        return next(new AppError(error.message || 'Error creating job', 500));
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, sort = '-createdAt' } = req.query;
        const skip = (page - 1) * limit;

        const jobs = await Job.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('companyId', 'name logo')
            .populate('createdBy', 'fullname email');

        const total = await Job.countDocuments();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching jobs:', error);
        next(new AppError(error.message || 'Failed to fetch jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getJobById = async (req, res, next) => {

    try {
        const job = await Job.findById(req.params.jobId)
            .populate('companyId', 'name logo description website location')
            .populate('createdBy', 'fullname email');

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Job fetched successfully",
            data: job
        });
    } catch (error) {
        logger.error('Error fetching job:', error);
        next(new AppError(error.message || 'Failed to fetch job', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        if (job.companyId.toString() !== req.user.companies[0]._id.toString()) {
            return next(new AppError('Not authorized to update this job', StatusCodes.FORBIDDEN));
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('companyId', 'name logo')
            .populate('createdBy', 'fullname email');

        logger.info(`Job updated: ${updatedJob._id} by company: ${req.user.companies[0]._id}`);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (error) {
        logger.error('Error updating job:', error);
        next(new AppError(error.message || 'Failed to update job', StatusCodes.BAD_REQUEST));
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        if (job.companyId.toString() !== req.user.companies[0]._id.toString()) {
            return next(new AppError('Not authorized to delete this job', StatusCodes.FORBIDDEN));
        }

        // Delete all applications for this job first
        const { Application } = await import('../models/application.model.js');
        const deletedApplications = await Application.deleteMany({ job: job._id });

        console.log(`Deleted ${deletedApplications.deletedCount} applications for job ${job._id}`);

        // Then delete the job
        await job.deleteOne();

        logger.info(`Job deleted: ${job._id} with ${deletedApplications.deletedCount} applications by company: ${req.user.companies[0]._id}`);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job deleted successfully',
            data: null
        });
    } catch (error) {
        logger.error('Error deleting job:', error);
        next(new AppError(error.message || 'Failed to delete job', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const searchJobs = async (req, res, next) => {
    try {
        const { 
            title, 
            location, 
            type, 
            minSalary, 
            maxSalary, 
            startDate,
            page = 1, 
            limit = 10 
        } = req.query;
        
        const query = {};
        const skip = (page - 1) * limit;

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            // Handle multiple job types separated by commas
            const jobTypes = type.split(',').map(t => t.trim());
            query.jobType = { $in: jobTypes };
        }

        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = Number(minSalary);
            if (maxSalary) query.salary.$lte = Number(maxSalary);
        }

        if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };
        }

        const jobs = await Job.find(query)
            .populate('companyId', 'name logo')
            .populate('createdBy', 'fullname email')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Job.countDocuments(query);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error searching jobs:', error);
        next(new AppError(error.message || 'Failed to search jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getJobsByCompany = async (req, res, next) => {
    try {
        const jobs = await Job.find({ companyId: req.user.companies[0]._id })
            .populate('createdBy', 'fullname email')
            .sort('-createdAt');

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Company jobs fetched successfully",
            data: jobs
        });
    } catch (error) {
        logger.error('Error fetching company jobs:', error);
        next(new AppError(error.message || 'Failed to fetch company jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};