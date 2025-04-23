# Job Portal Backend API

A robust and scalable backend API for a modern job portal application built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Job Seeker & Company)
- Job Posting and Management
- Job Application System
- Company Profile Management
- User Profile Management
- Job Search and Filtering
- Application Tracking
- Email Notifications
- File Upload (Resumes, Company Logos)
- Rate Limiting and Security Features

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for Password Hashing
- Multer for File Uploads
- Nodemailer for Email Notifications
- Winston for Logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-portal-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Authentication

#### Register User
- POST /api/v1/user/register
- Body: { name, email, password, role }

#### Login
- POST /api/v1/user/login
- Body: { email, password }

### Jobs

#### Create Job
- POST /api/v1/jobs
- Body: { title, description, company, location, salary, type, requirements }

#### Get All Jobs
- GET /api/v1/jobs
- Query Parameters: page, limit, search, location, type

#### Get Single Job
- GET /api/v1/jobs/:id

#### Update Job
- PUT /api/v1/jobs/:id

#### Delete Job
- DELETE /api/v1/jobs/:id

### Applications

#### Apply for Job
- POST /api/v1/applications
- Body: { jobId, resume, coverLetter }

#### Get User Applications
- GET /api/v1/applications/user

#### Get Company Applications
- GET /api/v1/applications/company

### Company Profile

#### Create/Update Company Profile
- POST /api/v1/company/profile
- Body: { name, description, website, logo, location }

#### Get Company Profile
- GET /api/v1/company/profile

### User Profile

#### Create/Update User Profile
- POST /api/v1/user/profile
- Body: { skills, experience, education, resume }

#### Get User Profile
- GET /api/v1/user/profile

## Error Handling

The API uses a consistent error handling format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "statusCode": 400,
    "message": "Detailed error message"
  }
}
```

## Security Features

- JWT Authentication
- Password Hashing
- Rate Limiting
- CORS Protection
- Input Validation
- File Upload Security
- Error Handling Middleware

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 