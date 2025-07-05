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
            job
        });
    } catch (error) {
        console.log(error);
        return next(new AppError('Error creating job', 500));
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
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
            data: jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching jobs:', error);
        next(new AppError('Failed to fetch jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getJobById = async (req, res, next) => {

    try {
        const job = await Job.findById(req.params.jobId)
            .populate('companyId', 'name logo description')
            .populate('createdBy', 'fullname email');

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: job
        });
    } catch (error) {
        logger.error('Error fetching job:', error);
        next(new AppError('Failed to fetch job', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        if (job.companyId.toString() !== req.user.companies[0]._id.toString()) {
            return next(new AppError('Not authorized to update this job', StatusCodes.FORBIDDEN));
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.jobId,
            req.body,
            { new: true, runValidators: true }
        ).populate('companyId', 'name logo')
            .populate('createdBy', 'fullname email');

        logger.info(`Job updated: ${updatedJob._id} by company: ${req.user.companies[0]._id}`);

        res.status(StatusCodes.OK).json({
            success: true,
            data: updatedJob
        });
    } catch (error) {
        logger.error('Error updating job:', error);
        next(new AppError('Failed to update job', StatusCodes.BAD_REQUEST));
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
            message: 'Job deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting job:', error);
        next(new AppError('Failed to delete job', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const searchJobs = async (req, res, next) => {
    try {
        const { title, location, type, minSalary, maxSalary } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            query.jobType = type;
        }

        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = Number(minSalary);
            if (maxSalary) query.salary.$lte = Number(maxSalary);
        }

        const jobs = await Job.find(query)
            .populate('companyId', 'name logo')
            .populate('createdBy', 'fullname email')
            .sort('-createdAt');

        res.status(StatusCodes.OK).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        logger.error('Error searching jobs:', error);
        next(new AppError('Failed to search jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getJobsByCompany = async (req, res, next) => {
    try {
        const jobs = await Job.find({ companyId: req.user.companies[0]._id })
            .populate('createdBy', 'fullname email')
            .sort('-createdAt');

        res.status(StatusCodes.OK).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        logger.error('Error fetching company jobs:', error);
        next(new AppError('Failed to fetch company jobs', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};