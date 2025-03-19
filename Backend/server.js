require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./lib/db.js");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Electricity Bill Management API is running...");
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
