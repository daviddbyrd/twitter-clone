import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { upload } from "../middleware/upload";
import {
  changeProfile,
  changeDescription,
  getUserInfo,
  getUsersByQuery,
  unfollow,
  follow,
  createUser,
} from "../controllers/userController";

const router = express.Router();

router.post(
  "/change-profile",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundPicture", maxCount: 1 },
  ]),
  asyncHandler(changeProfile)
);
router.post("/change-description", asyncHandler(changeDescription));
router.get("/user-info/:id", asyncHandler(getUserInfo));
router.get("/users/:query/:user_id", asyncHandler(getUsersByQuery));
router.post("/unfollow", asyncHandler(unfollow));
router.post("/follow", asyncHandler(follow));
router.post("/users", asyncHandler(createUser));

export default router;
