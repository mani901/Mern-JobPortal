import express from "express"
import { login, logOut, register, updateProfile } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logOut)
router.route("/profile/update").post(isAuthenticated, updateProfile)

export default router;