const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();   // ✅ THIS WAS MISSING

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const BACKEND_URL = process.env.BACKEND_URL || "http://backend-backend.backend.svc.cluster.local:4000";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users`, {
      timeout: 3000   // 🔴 VERY IMPORTANT
    });
    res.render("index", { users: response.data });
  } catch (err) {
    console.error("Backend error:", err.message);

    // ✅ Fail fast, do NOT block UI
    res.render("index", { users: [] });
  }
});


app.post("/add", async (req, res) => {
  try {
    await axios.post(`${BACKEND_URL}/users`, req.body);
  } catch (err) {
    console.error("Insert failed:", err.message);
  }
  res.redirect("/");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Frontend running on port 3000");
});
