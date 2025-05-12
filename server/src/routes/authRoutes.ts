import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  register,
  login,
  checkUniqueEmail,
  checkUniqueUsername,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/check-unique-email", asyncHandler(checkUniqueEmail));
router.post("/check-unique-username", asyncHandler(checkUniqueUsername));

export default router;
