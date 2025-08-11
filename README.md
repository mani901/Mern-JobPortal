# Job Portal (MERN)

Modern job portal with student and recruiter roles. Clean UI, scalable API, and production‑ready patterns.

## Features

- Auth with roles (student/recruiter)
- Companies: register, edit, logo upload
- Jobs: create, list, search, details, manage applicants
- Apply: cover letter + resume
- Saved jobs: bookmark/unbookmark & view
- Profiles: photo, resume, bio, skills
- Applicants: status updates, resume links
- Security: Helmet, CORS, rate limiting
- Toasts: react‑hot‑toast (bottom‑right)

## Tech

- Client: React 19, Vite, Tailwind, ShadCN, axios, react‑hot‑toast
- Server: Node, Express, MongoDB (Mongoose), Cloudinary, JWT, Multer

## Quick Start

1. Install

```bash
cd Server && npm i
cd ../Client && npm i
```

2. Server env (`Server/.env`)

```
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SMTP_HOST=your_smtp_host
SMTP_PORT=465
SMTP_USER=your_user
SMTP_PASS=your_pass
```

3. Run

```bash
# Server
cd Server && npm run dev
# Client (new terminal)
cd Client && npm run dev
```

Client: http://localhost:5173
Server: http://localhost:8000

## Key Endpoints

- User: /api/v1/user/register | login | logout | profile
- Company: /api/v1/company/register | get | get/:id | update/:id
- Jobs: /api/v1/jobs (CRUD, search, details, company jobs)
- Applications: /api/v1/applications/apply | my-applications | job-applications/:jobId
- Saved jobs: /api/v1/user/saved-jobs (GET), /api/v1/user/saved-jobs/toggle (POST)

## License

MIT
