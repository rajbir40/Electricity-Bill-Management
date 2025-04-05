const db = require('../lib/db');


const getAllBills = async(req , res)=>{
    try{
        const sql = "Select * from Bills";
        db.query(sql, (err, results) => {
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
}

module.exports = { getAllBills};