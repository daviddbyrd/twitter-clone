import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import cors from "cors";
import {
  getPostsById,
  makeReply,
  removeRepost,
  repost,
  like,
  unlike,
  postsFromFollowees,
  makePost,
  getPosts,
} from "../controllers/postController";

const saltRounds = 10;

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "davidbyrd",
  host: "localhost",
  database: "twitter_clone_db",
  password: "password",
  port: 5432,
});

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.get("/posts/:id", asyncHandler(getPostsById));

app.post("/make-reply", asyncHandler(makeReply));

app.post("/remove-repost", asyncHandler(removeRepost));

app.post("/repost", asyncHandler(repost));

app.post("/like", asyncHandler(like));

app.post("/unlike", asyncHandler(unlike));

app.get("/posts-from-followees/:user_id", asyncHandler(postsFromFollowees));

app.post("/make-post", asyncHandler(makePost));
