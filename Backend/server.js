const express = require("express");
const cors = require("cors");
const db = require("./lib/db.js");
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route.js');
const meterRoutes = require('./routes/meter.route.js');
const paymentRoutes = require('./routes/payment.route.js');
const billRoutes = require('./routes/bill.route.js');
const dotenv = require('dotenv');
// const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors({origin: "http://localhost:5173",credentials: true}));
require("dotenv").config();

io.on('connection', (socket) => {
    console.log('New client connected');
  
    // Suppose the client sends its userId on connection
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

console.log(process.env.GMAIL_USER);
app.get("/", (req, res) => {
    res.send("Electricity Bill Management API is running...");
});

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/meter',meterRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/bill',billRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
