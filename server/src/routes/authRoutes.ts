import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import cors from "cors";
import {
  register,
  login,
  checkUniqueEmail,
  checkUniqueUsername,
} from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";

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

app.post("/register", asyncHandler(register));

app.post("/login", asyncHandler(login));

app.post("/check-unique-email", asyncHandler(checkUniqueEmail));

app.post("/check-unique-username", asyncHandler(checkUniqueUsername));
