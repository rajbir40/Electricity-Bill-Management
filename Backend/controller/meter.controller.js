const db = require('../lib/db');

const  getUser = async (req,res) => {
    const meterid = req.query.meterid;
    const sql = "SELECT U.user_id, U.fullName, U.email, U.phone, M.meter_number, M.meter_type FROM Users U JOIN Meters M ON U.user_id = M.user_id WHERE M.meter_id = ?;"

    try{
        db.query(sql, meterid , (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.json(results);
        });
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {getUser} ;