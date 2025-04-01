const db = require('../lib/db');

const recordPayment = async (req, res) => {
    try {
        const { bill_id, user_id, amount_paid, payment_method, transaction_id } = req.body;
    
        if (!bill_id || !user_id || !amount_paid || !payment_method || !transaction_id) {
          return res.status(400).json({ error: "All fields are required" });
        }
    
        const query = `
          INSERT INTO Payments (bill_id, user_id, amount_paid, payment_method, transaction_id)
          VALUES (?, ?, ?, ?, ?)
        `;
    
        const [rows] = await db.promise().query(query, [bill_id, user_id, amount_paid, payment_method, transaction_id]);
    
        const [bill] = await db.promise().query(`UPDATE Bills SET status = 'paid' WHERE bill_id = ?`, [bill_id]);
    
        res.status(200).json({ success: true, message: "Payment recorded successfully" });
      } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};

module.exports = { recordPayment };