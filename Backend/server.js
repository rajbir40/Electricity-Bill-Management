const express = require("express");
const cors = require("cors");
const db = require("./lib/db.js");
const authRoutes = require('./routes/auth.route');
const dotenv = require('dotenv');

const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors());
require("dotenv").config();

console.log(process.env.GMAIL_USER);
app.get("/", (req, res) => {
    res.send("Electricity Bill Management API is running...");
});

app.use('/api/auth',authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
