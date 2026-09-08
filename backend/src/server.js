
const express = require("express");

const app = express();
const db = require("./database/db");

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Pricing engine API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
