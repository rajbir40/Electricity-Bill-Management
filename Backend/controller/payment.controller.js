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
const unpaidBills = async(req,res)=>{
  try {
    const query = `
    SELECT *,
      CASE 
        WHEN due_date < CURDATE() THEN total_amount + 50 
        ELSE total_amount 
      END AS final_amount,
      CASE 
        WHEN due_date < CURDATE() THEN 'overdue' 
        ELSE status 
      END AS updated_status
    FROM Bills WHERE status = 'unpaid' OR status = 'overdue';`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching unpaid bills:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(results);
    });
  } catch (error) {
    
  }
}
const payBill = async(req,res)=>{
  const { bill_id } = req.params;
  const updateQuery = "UPDATE Bills SET status = 'paid' WHERE bill_id = ?";
  
  db.query(updateQuery, [bill_id], (err, result) => {
    if (err) {
      console.error('Error updating bill status:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Payment successful' });
  });
}

module.exports = { recordPayment, unpaidBills, payBill};