import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { User } from '../models/user.model.js';

export const authenticateUser = async (req, res, next) => {
    console.log('🔐 authenticateUser middleware called');
    try {
        let token;

        // Check for token in cookies
        if (req.cookies.token) {
            token = req.cookies.token;
            console.log('🔐 Token found in cookies');
        }
        // Check for token in Authorization header
        else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('🔐 Token found in Authorization header');
        }

        if (!token) {
            console.log('🔐 No token found, returning unauthorized');
            return next(new AppError('Not authenticated', StatusCodes.UNAUTHORIZED));
        }

        // Verify token
        console.log('🔐 Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 Token decoded:', decoded);

        const user = await User.findById(decoded.userid).populate('companies').select('-password');
        console.log('🔐 Found user:', user ? 'YES' : 'NO');

        if (!user) {
            console.log('🔐 User not found in database');
            return next(new AppError('User not found', StatusCodes.NOT_FOUND));
        }

        // Attach user to request
        req.user = user;
        console.log('🔐 User attached to request, role:', user.role);
        next();
    } catch (error) {
        console.log('🔐 Authentication error:', error.message);
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