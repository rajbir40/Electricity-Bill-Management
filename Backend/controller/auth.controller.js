const bcrypt = require('bcrypt');
const db = require('../lib/db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const signup = async function(req, res) {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password || !phone || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO Users (fullName, email, password, phone, address) VALUES (?, ?, ?, ?, ?)`;
        const values = [fullName, email, hashedPassword, phone, address];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const login = async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required" });
      }
  
      try {
          // Check if user exists
          const sql = `SELECT * FROM users WHERE email = ?`;
          db.query(sql, [email], async (err, results) => {
              if (err) {
                  console.error("Database error:", err);
                  return res.status(500).json({ error: "Database error" });
              }
  
              // If user does not exist
              if (results.length === 0) {
                  return res.status(401).json({ error: "Invalid email or password" });
              }
  
              const user = results[0];
  
              // Compare hashed passwords
              const passwordMatch = await bcrypt.compare(password, user.password);
              if (!passwordMatch) {
                  return res.status(401).json({ error: "Invalid email or password" });
              }
              const token = jwt.sign(
                { id: user.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
  
              // Success response
            //   console.log(token);
            res.status(200).json({ 
            message: "Login successful", 
            token: token, 
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role // make sure 'role' is a column in your 'users' table
            } 
            });
              
          });
      } catch (error) {
          console.error("Internal server error:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  };

  const generateOTP = ()=> Math.floor(100000 + Math.random() * 900000).toString();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  })
  const forgotpassword = async(req,res)=>{
    console.log("Email:", process.env.GMAIL_USER);
console.log("Password:", process.env.GMAIL_PASS ? "Loaded" : "Not Loaded");

    const {email} = req.body;
    if(!email){
      return res.status(400).json({error: "Email is required"});
    }
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5*60*1000).toISOString()
    .slice(0, 19)
    .replace("T", " ");
    const sql = `update Users set otp=?, otp_expiry=? where email=?`;
    db.query(sql,[otp, expiry, email], async(err,result)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({error: "Database error"});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Email not found" });
        }
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Email sending failed" });
            }
            res.json({ message: "OTP sent to email" });
        });
    })
  }
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }
    const sql = `SELECT otp FROM users WHERE email=?`;
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Email not found" });
        }

        const { otp: storedOTP} = result[0];


        // Convert both OTPs to strings and trim any extra spaces
        if (String(storedOTP).trim() !== String(otp).trim()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        res.json({ message: "OTP verified. Proceed to reset password." });
    });
};


  const resetPassword = async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "Email and password are required"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?`;
    db.query(sql,[hashedPassword, email], async(err,result)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({error: "Database error"});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Email not found" });
        }
        res.json({ message: "Password reset successful" });
    })
  }

  const checkingAuth = async(req,res) => {
    try{
      res.status(200).json(req.user);
    }
    catch(err){
      console.log("Error checking auth",err.message);
      res.status(500).json({message:"Internal Server Error"});
    }
  }
  

module.exports = { signup, login, forgotpassword , verifyOTP, resetPassword , checkingAuth};
