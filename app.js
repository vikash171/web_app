const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Offline Games App" });
});

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!  good sagdfaqwdr" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

