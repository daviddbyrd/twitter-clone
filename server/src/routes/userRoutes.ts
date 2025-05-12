import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import cors from "cors";
import {
  changeProfile,
  changeDescription,
  getUserInfo,
  getUsersByQuery,
  unfollow,
  follow,
  createUser,
} from "../controllers/userController";

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

app.post("/change-profile", asyncHandler(changeProfile));

app.post("/change-description", asyncHandler(changeDescription));

app.get("/user-info/:id", asyncHandler(getUserInfo));

app.get("/users/:query/:user_id", asyncHandler(getUsersByQuery));

app.post("/unfollow", asyncHandler(unfollow));

app.post("/follow", asyncHandler(follow));

app.post("/users", asyncHandler(createUser));
