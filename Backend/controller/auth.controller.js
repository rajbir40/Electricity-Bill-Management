const bcrypt = require('bcrypt');
const db = require('../lib/db');

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
  
              // Success response
              res.status(200).json({ message: "Login successful", userId: user.id });
          });
      } catch (error) {
          console.error("Internal server error:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  };
module.exports = { signup, login };
