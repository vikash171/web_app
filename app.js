const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // ✅ serves script.js, style.css, etc.

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/photos", (req, res) => {
  res.render("photos");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
