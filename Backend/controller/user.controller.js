const db = require('../lib/db');

const getAllUsers = async (req, res) => {
    try {
        const sql = "SELECT * FROM Users;";
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

const getUser = async (req, res) => {
    try {
        const userid = req.params.user_id; // or req.params.userid if that's how your route is defined
        const sql = "SELECT * FROM Users WHERE user_id = ?;";
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


module.exports = { getAllUsers  , getBillingHistory , getUser};