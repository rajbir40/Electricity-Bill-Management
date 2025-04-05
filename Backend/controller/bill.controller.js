const db = require('../lib/db');


const getAllBills = async(req , res)=>{
    try{
        const sql = "SELECT b.bill_id, b.user_id, b.meter_id, b.billing_month, b.units_consumed, b.total_amount, b.due_date, b.status, b.generated_at, f.fine_id, f.fine_amount, f.fine_reason, f.fine_date FROM Bills b LEFT JOIN Fines f ON b.bill_id = f.bill_id AND b.user_id = f.user_id;";
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