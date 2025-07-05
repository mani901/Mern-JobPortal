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
    console.log('📬 sendEmail called with options:', options);
    try {
        const mailOptions = {
            from: `Job Portal <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        console.log('📬 Mail options:', mailOptions);
        console.log('📬 SMTP config check - HOST:', process.env.SMTP_HOST, 'USER:', process.env.SMTP_USER);

        await transporter.sendMail(mailOptions);
        console.log('📬 Email sent successfully via transporter');
    } catch (error) {
        console.log('📬 ERROR in sendEmail:', error.message);
        throw new AppError('Failed to send email', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

export const sendApplicationNotification = async (application, job, user) => {
    console.log('📧 sendApplicationNotification called');
    console.log('📧 Application:', application);
    console.log('📧 Job:', job);
    console.log('📧 User:', user);

    try {
        const html = `
        <h1>New Job Application</h1>
        <p>A new application has been received for the position: ${job.title}</p>
        <p>Applicant: ${user.fullname}</p>
        <p>Email: ${user.email}</p>
        <p>Cover Letter: ${application.coverLetter}</p>
      `;

        console.log('📧 Sending email to:', job.companyId.email);
        await sendEmail({
            email: job.companyId.email,
            subject: `New Application for ${job.title}`,
            html
        });
        console.log('📧 Email sent successfully');
    } catch (error) {
        console.log('📧 ERROR in sendApplicationNotification:', error.message);
        throw error;
    }
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