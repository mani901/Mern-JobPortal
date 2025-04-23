import { StatusCodes } from 'http-status-codes';
import { Job } from '../models/job.model.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            ...req.body,
            company: req.user.company,
            createdBy: req.user._id
        });

        logger.info(`New job created: ${job._id} by company: ${req.user.company}`);

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: job
        });
    } catch (error) {
        logger.error('Error creating job:', error);
        next(new AppError('Failed to create job', StatusCodes.BAD_REQUEST));
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
            .populate('company', 'name logo')
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
        const job = await Job.findById(req.params.id)
            .populate('company', 'name logo description')
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
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

        if (job.company.toString() !== req.user.company.toString()) {
            return next(new AppError('Not authorized to update this job', StatusCodes.FORBIDDEN));
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('company', 'name logo')
            .populate('createdBy', 'fullname email');

        logger.info(`Job updated: ${updatedJob._id} by company: ${req.user.company}`);

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

        if (job.company.toString() !== req.user.company.toString()) {
            return next(new AppError('Not authorized to delete this job', StatusCodes.FORBIDDEN));
        }

        await job.deleteOne();

        logger.info(`Job deleted: ${job._id} by company: ${req.user.company}`);

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
            .populate('company', 'name logo')
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
        const jobs = await Job.find({ company: req.user.company })
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