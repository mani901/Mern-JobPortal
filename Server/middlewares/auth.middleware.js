import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { User } from '../models/user.model.js';

export const authenticateUser = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Check for token in Authorization header
        else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new AppError('User not found', StatusCodes.NOT_FOUND));
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `Role ${req.user.role} is not authorized to access this route`,
                    StatusCodes.FORBIDDEN
                )
            );
        }
        next();
    };
}; 