import express from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getPostsById,
  makeReply,
  removeRepost,
  repost,
  like,
  unlike,
  postsFromFollowees,
  makePost,
  getPost,
  getReplies,
} from "../controllers/postController";

const router = express.Router();

router.get("/posts/:id", asyncHandler(getPostsById));
router.post("/make-reply", asyncHandler(makeReply));
router.post("/remove-repost", asyncHandler(removeRepost));
router.post("/repost", asyncHandler(repost));
router.post("/like", asyncHandler(like));
router.post("/unlike", asyncHandler(unlike));
router.get("/posts-from-followees/:user_id", asyncHandler(postsFromFollowees));
router.post("/make-post", asyncHandler(makePost));
router.get("get-post/:id", asyncHandler(getPost));
router.get("get-replies/:id", asyncHandler(getReplies));

export default router;
