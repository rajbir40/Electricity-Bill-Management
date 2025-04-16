const db = require('../lib/db');

const getAllUsers = async (req, res) => {
    try {
        const sql = "SELECT * FROM Users;";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            // console.log(results);
            return res.json(results[0]);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const userid = req.params.user_id;
        const sql = `
            SELECT 
                u.user_id,
                u.fullName,
                u.email,
                u.phone,
                u.role,
                u.address,
                m.meter_number AS meterNumber
            FROM Users u
            LEFT JOIN Meters m ON u.user_id = m.user_id
            WHERE u.user_id = ?;
        `;
        db.query(sql, userid, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.json(results);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};




const getBillingHistory = async (req , res)=> {
    try{
        const userid =  req.query.userid; 
        const sql = "SELECT B.bill_id, U.fullName, B.billing_month, B.units_consumed, B.total_amount, B.status FROM Bills B JOIN Users U ON B.user_id = U.user_id WHERE U.user_id = ? ;";
        db.query(sql,userid ,  (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.json(results);
        });
        
    }catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    const user_id = req.params.user_id;
    const { fullName, email, phone, address } = req.body;
    try {
      await db.promise().query(
        `UPDATE Users 
         SET fullName = ?, email = ?, phone = ?, address = ? 
         WHERE user_id = ?`,
        [fullName, email, phone, address, user_id]
      );
      res.json({ success: true, message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Update failed" });
    }
  };

  const getUsersCount = async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) AS count FROM Users;";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.json(results);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const fetchAllUsers = async (req, res) => {
    try {
        const sql = "SELECT * FROM Users;";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            // console.log(results);
            return res.json(results);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
  
module.exports = { getAllUsers  , getBillingHistory , getUser, updateUser , getUsersCount  , fetchAllUsers};