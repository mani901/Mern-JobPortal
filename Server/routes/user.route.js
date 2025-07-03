import express from "express"
import { login, logOut, register, updateProfile, getProfile } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logOut)
router.route("/profile").get(isAuthenticated, getProfile)
router.route("/profile/update").post(isAuthenticated, updateProfile)

export default router;