import express from 'express';
import multer from "multer";
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJobs,
    getJobsByCompany
} from '../controllers/job.controller.js';


const upload = multer();
const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/search', searchJobs);
router.get('/details/:jobId', getJobById);

// Protected routes
router.post('/create-job', authenticateUser,upload.none(), authorizeRoles('recruiter'), createJob);
router.put('/:id', authenticateUser, authorizeRoles('recruiter'), updateJob);
router.delete('/:id', authenticateUser, authorizeRoles('recruiter'), deleteJob);
router.get('/company/my-jobs', authenticateUser, authorizeRoles('recruiter'), getJobsByCompany);

export default router; 