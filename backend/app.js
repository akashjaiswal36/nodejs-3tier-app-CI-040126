const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,

  // 🔴 IMPORTANT FIX
  ssl: false,

  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 5000
});


app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "DB not ready" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2)",
      [name, email]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("Insert error:", err.message);
    res.status(500).json({ error: "Insert failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
