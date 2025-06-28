import nodemailer from 'nodemailer';
import { StatusCodes } from 'http-status-codes';
import AppError from './AppError.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `Job Portal <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new AppError('Failed to send email', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const sendApplicationNotification = async (application, job, user) => {
    const html = `
    <h1>New Job Application</h1>
    <p>A new application has been received for the position: ${job.title}</p>
    <p>Applicant: ${user.name}</p>
    <p>Email: ${user.email}</p>
    <p>Cover Letter: ${application.coverLetter}</p>
  `;

    await sendEmail({
        email: job.company.email,
        subject: `New Application for ${job.title}`,
        html
    });
};

export const sendApplicationStatusUpdate = async (application, job, user) => {
    const html = `
    <h1>Application Status Update</h1>
    <p>Your application for ${job.title} has been ${application.status}.</p>
    <p>Company: ${job.company.name}</p>
    <p>Position: ${job.title}</p>
    <p>Status: ${application.status}</p>
  `;

    await sendEmail({
        email: user.email,
        subject: `Application Status Update - ${job.title}`,
        html
    });
}; 