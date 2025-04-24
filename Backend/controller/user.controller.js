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

const deleteuser = async (req, res) => {
    const selectedId = req.query.userid;
    console.log("Deleting user with ID:", selectedId);
    try {
        // Delete entries in child tables first (respecting foreign key constraints)
        const queries = [
            'DELETE FROM Payments WHERE user_id = ?',
            'DELETE FROM Fines WHERE user_id = ?',
            'DELETE FROM Receipts WHERE user_id = ?',
            'DELETE FROM Notifications WHERE user_id = ?',
            // 'DELETE FROM AdminActions WHERE admin_id = ?',
            'DELETE FROM Bills WHERE user_id = ?',
            'DELETE FROM Meters WHERE user_id = ?',
            // Finally delete the user
            'DELETE FROM Users WHERE user_id = ?'
        ];

        for (const query of queries) {
            await new Promise((resolve, reject) => {
                db.query(query, [selectedId], (err, results) => {
                    if (err) {
                        console.error(`Error running query: ${query}`, err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        }

        return res.json({ message: "User and all associated data deleted successfully" });

    } catch (error) {
        console.error("Error deleting user and related data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

  
module.exports = { getAllUsers  ,deleteuser ,  getBillingHistory , getUser, updateUser , getUsersCount  , fetchAllUsers};