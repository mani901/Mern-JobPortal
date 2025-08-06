import mongoose, { Mongoose } from "mongoose";


const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: {
            public_id: { type: String },
            url: { type: String }
        },
        resumeOriginalName: { type: String },
        
        profilePhoto: {
            public_id: { type: String },
            url: { type: String }
        }
    },
    companies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],

}, { timestamps: true })

export const User = mongoose.model('User', UserSchema);