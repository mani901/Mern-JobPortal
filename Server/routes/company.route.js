import express from "express"
import multer from "multer";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const upload = multer();

const router = express.Router();

router.route("/register").post(isAuthenticated, upload.none(),registerCompany);
router.route("/get").get(isAuthenticated, getCompany)
router.route("/get/:id").get(isAuthenticated, getCompanyById)
router.route("/update/:id").put(isAuthenticated, updateCompany)

export default router;