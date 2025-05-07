import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

app.get(
  "/posts-from-followees/:user_id",
  asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const sql_query = `
      SELECT p.id, p.content, p.user_id, p.created_at, u.username, u.display_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
        OR p.user_id IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      ORDER BY p.created_at
      LIMIT 20;
    `;
    const response = await pool.query(sql_query, [user_id]);
    res.status(200).json(response.rows);
  })
);

const getUsersByQuery = async (query: string, user_id: string) => {
  try {
    const sql_query = `
      SELECT
        u.id,
        u.username,
        u.display_name,
        GREATEST(
          similarity(u.username, $1),
          similarity(u.display_name, $1)
        ) AS sim,
        CASE
          WHEN f.follower_id IS NOT NULL THEN true
          ELSE false
        END AS is_following
      FROM users u    
      LEFT JOIN follows f ON f.followee_id = u.id AND f.follower_id = $2
      WHERE
        (u.username % $1 OR u.display_name % $1)
      ORDER BY sim DESC
      LIMIT 10;
    `;

    const response = await pool.query(sql_query, [query, user_id]);
    return response.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

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
    console.log(`follower: ${follower_id}, followee: ${followee_id}`);
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
    console.log(`follower: ${follower_id}, followee: ${followee_id}`);
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
  "/make-post",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, content } = req.body;
    await pool.query("INSERT INTO posts (user_id, content) VALUES ($1, $2)", [
      userId,
      content,
    ]);
    res.status(201).json({ message: "Post made successfully." });
  })
);

app.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, username, displayName, dob, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO users (email, username, display_name, dob, password_hash) VALUES ($1, $2, $3, $4, $5)",
      [email, username, displayName, dob, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  })
);

app.post(
  "/posts",
  asyncHandler(async (req: Request, res: Response) => {
    const { post } = req.body;
    const result = await pool.query(
      "INSERT INTO posts (post) VALUES ($1) RETURNING *",
      [post]
    );
    res.status(201).json(result.rows[0]);
  })
);

const verifyPassword = async (
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

const checkValidUsernamePassword = async (
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
        success: true,
        id: null,
      };
    }
    console.log(rows);
    if (!verifyPassword(password, rows[0].password_hash)) {
      return {
        success: true,
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

const checkValidEmailPassword = async (email: string, password: string) => {
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
  }
};

app.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { usernameOrEmail, password } = req.body;
      let response = await checkValidEmailPassword(usernameOrEmail, password);
      if (response.success) {
        const payload = { id: response.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.json({ token });
        return;
      }
      response = await checkValidUsernamePassword(usernameOrEmail, password);
      console.log(response);
      if (response.success) {
        const payload = { id: response.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
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

app.post(
  "/check-unique-email",
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already taken" });
    }
    res.status(200).json({ message: "Email is available" });
  })
);

app.post(
  "/check-unique-username",
  asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    res.status(201).json({ message: "Username is available" });
  })
);

app.post(
  "/posts",
  asyncHandler(async (req: Request, res: Response) => {
    const { post } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO posts (post) VALUES ($1) RETURNING *",
        [post]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error inserting post");
    }
  })
);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
