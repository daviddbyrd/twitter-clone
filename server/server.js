const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  user: "davby",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
    console.log(res);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
