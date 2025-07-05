import express from 'express';
import multer from "multer";
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
    applyForJob,
    getApplicationsByUser,
    getApplicationsByJob,
    updateApplicationStatus,
    getApplicationById
} from '../controllers/application.controller.js';
const upload = multer();
const router = express.Router();

// Protected routes
router.post('/apply', authenticateUser, upload.none(),authorizeRoles('student'), applyForJob);
router.get('/my-applications', authenticateUser, authorizeRoles('student'), getApplicationsByUser);
router.get('/job/:jobId', authenticateUser, authorizeRoles('recruiter'), getApplicationsByJob);
router.get('/:id', authenticateUser, getApplicationById);
router.patch('/:id/status', authenticateUser, authorizeRoles('student'), updateApplicationStatus);

export default router; 