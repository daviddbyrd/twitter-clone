const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

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

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
    console.log(res);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.post("/check-unique-email", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already taken" });
    }

    res.status(200).json({ message: "Email is available" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking email" });
  }
});

app.post("/check-unique-username", async (req, res) => {
  const { username } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    res.status(200).json({ message: "Username is available" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking username" });
  }
});

app.post("/posts", async (req, res) => {
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
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
