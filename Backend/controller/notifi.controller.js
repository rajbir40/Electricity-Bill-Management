const db = require('../lib/db');
// make sure you imported your db connection

const getallnotifi = async (req, res) => {
    try {
        const userId = req.query.userId; // ✅ get userId from query
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const sql = "SELECT * FROM Notifications WHERE user_id = ? AND dismissed = FALSE";
        db.query(sql, [userId], (err, results) => {
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

module.exports = {
    getallnotifi
};
