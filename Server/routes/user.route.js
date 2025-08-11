import express from "express"
import { login, logOut, register, updateProfile, getProfile, toggleSaveJob, getSavedJobs } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import multerUpload from "../middlewares/multer.middleware.js";
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logOut)
router.route("/profile").get(isAuthenticated, getProfile)


router.route("/profile/update").post(isAuthenticated, multerUpload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), updateProfile);

// Saved jobs
router.route('/saved-jobs/toggle').post(isAuthenticated, toggleSaveJob)
router.route('/saved-jobs').get(isAuthenticated, getSavedJobs)

export default router;