import express from 'express';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
    applyForJob,
    getApplicationsByUser,
    getApplicationsByJob,
    updateApplicationStatus,
    getApplicationById
} from '../controllers/application.controller.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateUser, authorizeRoles(['user']), applyForJob);
router.get('/my-applications', authenticateUser, authorizeRoles(['user']), getApplicationsByUser);
router.get('/job/:jobId', authenticateUser, authorizeRoles(['company']), getApplicationsByJob);
router.get('/:id', authenticateUser, getApplicationById);
router.patch('/:id/status', authenticateUser, authorizeRoles(['company']), updateApplicationStatus);

export default router; 