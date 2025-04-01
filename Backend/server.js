const express = require("express");
const cors = require("cors");
const db = require("./lib/db.js");
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route.js');
const meterRoutes = require('./routes/meter.route.js');
const dotenv = require('dotenv');

const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors({origin: "http://localhost:5173",credentials: true}));
require("dotenv").config();

console.log(process.env.GMAIL_USER);
app.get("/", (req, res) => {
    res.send("Electricity Bill Management API is running...");
});

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/meter',meterRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
