import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import cors from "cors";
import { getUsersByQuery } from "../controllers/userController";

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

app.post(
  "/change-profile",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, display_name, description } = req.body;
    const sql_query = `
      UPDATE users
      SET display_name = $2, description = $3
      WHERE id = $1
    `;
    const response = await pool.query(sql_query, [
      id,
      display_name,
      description,
    ]);
    res.status(201).json({ message: "Profile updated successfully." });
  })
);

app.post(
  "/change-description",
  asyncHandler(async (req: Request, res: Response) => {
    const { id, description } = req.body;
    const sql_query = `
      UPDATE users
      SET description = $2
      WHERE id = $1;  
    `;
    const response = await pool.query(sql_query, [id, description]);
    res.status(201).json({ message: "Description added successfully." });
  })
);

app.get(
  "/user-info/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sql_query = `
      WITH user_stats AS (
        SELECT
          u.id,
          COUNT(DISTINCT following.followee_id) AS following_count,
          COUNT(DISTINCT followers.follower_id) AS follower_count,
          COUNT(DISTINCT p.id) AS post_count
        FROM users u
        LEFT JOIN follows following ON following.follower_id = u.id
        LEFT JOIN follows followers ON followers.followee_id = u.id 
        LEFT JOIN posts p ON p.user_id = u.id 
        WHERE u.id = $1
        GROUP BY u.id
      )
      SELECT 
        u.id,
        u.display_name,
        u.username,
        u.dob,
        u.created_at,
        u.description,
        us.following_count,
        us.follower_count,
        us.post_count
      FROM users u
      LEFT JOIN user_stats us ON us.id = u.id
      WHERE u.id = $1;
    `;
    const response = await pool.query(sql_query, [id]);
    console.log(response.rows);
    res.status(200).json(response.rows);
  })
);

app.get(
  "/users/:query/:user_id",
  asyncHandler(async (req: Request, res: Response) => {
    const { query, user_id } = req.params;
    const users = await getUsersByQuery(query, user_id);
    if (!users) throw new Error("Error getting users by query");
    res.status(200).json(users);
  })
);

app.post(
  "/unfollow",
  asyncHandler(async (req: Request, res: Response) => {
    const { follower_id, followee_id } = req.body;
    const sql_query = `
      DELETE FROM follows f WHERE f.follower_id = $1 AND f.followee_id = $2;
    `;
    await pool.query(sql_query, [follower_id, followee_id]);
    res.status(201).json({ message: "Follow successful." });
  })
);

app.post(
  "/follow",
  asyncHandler(async (req: Request, res: Response) => {
    const { follower_id, followee_id } = req.body;
    try {
      const sql_query = `
      INSERT INTO follows (follower_id, followee_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, followee_id) DO NOTHING;
    `;
      await pool.query(sql_query, [follower_id, followee_id]);
      res.status(201).json({ message: "Follow successful." });
    } catch (err) {
      console.error(err);
    }
  })
);

app.post(
  "/users",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  })
);
