import express from 'express';
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

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', authenticateUser, authorizeRoles(['company']), createJob);
router.put('/:id', authenticateUser, authorizeRoles(['company']), updateJob);
router.delete('/:id', authenticateUser, authorizeRoles(['company']), deleteJob);
router.get('/company/my-jobs', authenticateUser, authorizeRoles(['company']), getJobsByCompany);

export default router; 