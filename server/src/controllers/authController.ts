import { Request, Response } from "express";
import { pool } from "../db/pool";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const register = async (req: Request, res: Response) => {
  const { email, username, displayName, dob, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await pool.query(
    "INSERT INTO users (email, username, display_name, dob, password_hash) VALUES ($1, $2, $3, $4, $5)",
    [email, username, displayName, dob, hashedPassword]
  );
  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    let response = await checkValidEmailPassword(usernameOrEmail, password);
    if (!response) throw new Error("Error checking valid email");
    if (response.success) {
      const payload = { id: response.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
      res.json({ token });
      return;
    }
    response = await checkValidUsernamePassword(usernameOrEmail, password);
    if (!response) throw new Error("Error checking valid email");
    if (response.success) {
      const payload = { id: response.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });
      res.json({ token });
      return;
    }
    return res.status(401).json({ message: "Invalid credentials." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in." });
  }
};

export const checkUniqueEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length > 0) {
    return res.status(400).json({ message: "Email already taken" });
  }
  res.status(200).json({ message: "Email is available" });
};

export const checkUniqueUsername = async (req: Request, res: Response) => {
  const { username } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (result.rows.length > 0) {
    return res.status(400).json({ message: "Username already taken" });
  }

  res.status(200).json({ message: "Username is available" });
};

export const verifyPassword = async (
  enteredPassword: string,
  passwordHash: string
) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, passwordHash);
    return isMatch;
  } catch (err) {
    console.error(err);
  }
};

export const checkValidUsernamePassword = async (
  username: string,
  password: string
) => {
  try {
    const response = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const rows = response.rows;
    if (rows.length === 0) {
      return {
        success: false,
        id: null,
      };
    }
    if (!verifyPassword(password, rows[0].password_hash)) {
      return {
        success: false,
        id: null,
      };
    }
    return {
      success: true,
      id: rows[0].id,
    };
  } catch (err) {
    console.error(err);
  }
};

export const checkValidEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const rows = response.rows;
    if (rows.length === 0) {
      return {
        success: false,
        id: null,
      };
    }
    if (!verifyPassword(password, rows[0].password_hash)) {
      return {
        success: false,
        id: null,
      };
    }
    return {
      success: true,
      id: rows[0].id,
    };
  } catch (err) {
    console.error(err);
    return;
  }
};
