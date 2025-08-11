import { StatusCodes } from 'http-status-codes';
import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import { sendApplicationNotification, sendApplicationStatusUpdate } from '../utils/email.js';
import { uploadToCloudinary } from '../utils/fileUpload.js';

export const applyForJob = async (req, res, next) => {
    console.log('Starting applyForJob function');
    try {
       

        const { jobId, coverLetter } = req.body;
        const userId = req.user._id;

        

       
        const job = await Job.findById(jobId).populate('companyId', 'name email');
       
        if (!job) {
           
            return next(new AppError('Job not found', StatusCodes.NOT_FOUND));
        }

       
        
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });
     

        if (existingApplication) {
           
            return next(new AppError('You have already applied for this job', StatusCodes.BAD_REQUEST));
        }

        console.log('Creating new application...');
        let resumeData = null;
        let resumeOriginalName = undefined;
        const files = req.files;
        if (files && files.resume) {
            const resumeFile = files.resume[0];
            const result = await uploadToCloudinary(resumeFile.buffer, 'resumes');
            resumeData = {
                public_id: result.public_id,
                url: result.url
            };
            resumeOriginalName = resumeFile.originalname;
        } else if (req.user?.profile?.resume?.url) {
            // Fallback to user's profile resume if no file uploaded
            resumeData = {
                public_id: req.user.profile.resume.public_id,
                url: req.user.profile.resume.url
            };
            resumeOriginalName = req.user.profile.resumeOriginalName;
        }

        const application = await Application.create({
            job: jobId,
            applicant: userId,
            coverLetter,
            resume: resumeData,
            resumeOriginalName
        });
        

       
        job.applications.push(application._id);
        await job.save();
        console.log('Job updated with application');

        // Send email notification
        //console.log('📧 Sending email notification...');
       // await sendApplicationNotification(application, job, req.user);
       

        //logger.info(`New application created: ${application._id} for job: ${jobId}`);

        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        logger.error('Error creating application:', error);
        next(new AppError(error.message || 'Failed to create application', StatusCodes.BAD_REQUEST));
    }
};

export const getApplicationsByUser = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: 'job',
                select: 'title company location',
                populate: {
                    path: 'companyId',
                    select: 'name logo'
                }
            })
            .sort('-createdAt');
            console.log(applications);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Applications fetched successfully',
            data: applications
        });
    } catch (error) {
        logger.error('Error fetching user applications:', error);
        next(new AppError(error.message || 'Failed to fetch applications', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getApplicationsByJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        // Verify job belongs to company
        const job = await Job.findOne({
            _id: jobId,
            companyId: { $in: req.user.companies[0]._id }
        });

        if (!job) {
            return next(new AppError('Job not found or unauthorized', StatusCodes.NOT_FOUND));
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'fullname email')
            .sort('-createdAt');

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Job applications fetched successfully',
            data: applications
        });
    } catch (error) {
        logger.error('Error fetching job applications:', error);
        next(new AppError(error.message || 'Failed to fetch applications', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate({
                path: 'job',
                select: 'title company location',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            })
            .populate('applicant', 'fullname email');

        if (!application) {
            return next(new AppError('Application not found', StatusCodes.NOT_FOUND));
        }

        // Check authorization
        if (
            application.applicant._id.toString() !== req.user._id.toString() &&
            application.job.company.toString() !== req.user.company?.toString()
        ) {
            return next(new AppError('Not authorized to view this application', StatusCodes.FORBIDDEN));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application fetched successfully',
            data: application
        });
    } catch (error) {
        logger.error('Error fetching application:', error);
        next(new AppError(error.message || 'Failed to fetch application', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { newStatus: status } = req.body;
        const { applicationId } = req.params;
console.log('Starting updateApplicationStatus function', { status, applicationId });
        const application = await Application.findById(applicationId)
            

        if (!application) {
            return next(new AppError('Application not found', StatusCodes.NOT_FOUND));
        }
/*
        // Verify company owns the job
        if (application.job.company._id.toString() !== req.user.company.toString()) {
            return next(new AppError('Not authorized to update this application', StatusCodes.FORBIDDEN));
        }
*/
        application.status = status;
        await application.save();

        // Send email notification
       // await sendApplicationStatusUpdate(application, application.job, application.applicant);

        logger.info(`Application status updated: ${applicationId} to ${status}`);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Application status updated',
            data: application
        });
    } catch (error) {
        logger.error('Error updating application status:', error);
        next(new AppError(error.message || 'Failed to update application status', StatusCodes.BAD_REQUEST));
    }
}; 