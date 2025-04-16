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
    
        const [payment] = await db.promise().query(query, [bill_id, user_id, amount_paid, payment_method, transaction_id]);
    
        const [bill] = await db.promise().query(`UPDATE Bills SET status = 'paid' WHERE bill_id = ?`, [bill_id]);

        generateBill(bill_id,user_id,payment)
    
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

const getTotalRevenue = async (req, res) => {
    try {
      const query = `SELECT SUM(amount_paid) AS total_revenue FROM Payments`;
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching total revenue:', err);
          return res.status(500).json({ message: 'Server error' }); 
        }
        res.json(results[0]); 
      }); 
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  };

  const getDueAmount = async (req, res) => {
    try {
      const query = `SELECT SUM(total_amount) AS due_amount FROM Bills WHERE status = 'unpaid'`;
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching total revenue:', err);
          return res.status(500).json({ message: 'Server error' }); 
        }
        res.json(results[0]); 
      }); 
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  };

  const getPaymentReport = async (req, res) => {
    try {
      const query = `SELECT SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) AS paid, SUM(CASE WHEN status = 'unpaid' THEN total_amount ELSE 0 END) AS unpaid, SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) AS overdue FROM Bills;
`;
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching total revenue:', err);
          return res.status(500).json({ message: 'Server error' }); 
        }
        res.json(results[0]); 
      }); 
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  };

module.exports = { recordPayment, unpaidBills, payBill ,getTotalRevenue , getDueAmount , getPaymentReport};