const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "davby",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
    console.log(res);
  } catch (err) {
    res.status(500).send(err.toString());
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
