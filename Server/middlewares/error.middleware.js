import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
    console.log('ERROR HANDLER CALLED');
    console.log('Error message:', err.message);
    console.log(' Error stack:', err.stack);
    console.log(' Error statusCode:', err.statusCode);

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong!';
    const error = {
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };

    // Log the error
    console.error(err);

    console.log('Sending error response:', { success: false, message, error });
    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

export default errorHandler; 