const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

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

app.post("/register", async (req, res) => {
  const { email, username, displayName, dob, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO users (email, username, display_name, dob, password_hash) VALUES ($1, $2, $3, $4, $5)",
      [email, username, displayName, dob, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
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

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
    console.log(res);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

const verifyPassword = async (enteredPassword, passwordHash) => {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, passwordHash);
    return isMatch;
  } catch (err) {
    console.error(err);
  }
};

const checkValidUsernamePassword = async (username, password) => {
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

const checkValidEmailPassword = async (email, password) => {
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

app.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    let response = await checkValidEmailPassword(usernameOrEmail, password);
    console.log(response);
    if (response.success) {
      const payload = { id: response.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
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
});

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "Error adding user" });
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
