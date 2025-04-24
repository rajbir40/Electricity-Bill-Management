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

const getPendingBills = async (req,res) => {
    try{
        const user_id = req.params.user_id;
        const query = `SELECT * FROM Bills WHERE user_id = ? AND status = 'unpaid'`;
        const bills = await db.promise().query(query,[user_id]);
        res.status(200).json(bills[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const fetchBillDetails = async (req,res) => {
    try{
        const bill_id = req.params.bill_id;
        const query = `SELECT * FROM Bills WHERE bill_id = ?`;
        const bill = await db.promise().query(query,[bill_id]);
        res.status(200).json(bill[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}  

const receipt = async (req, res) => {
    const { receipt_number, account_number, user_id, payment_method, amount, bill_id } = req.body;
    if (!bill_id) return res.status(400).json({ error: 'Missing bill_id' });
    try {
        console.log(req.body);
        const [existing] = await db.promise().query(`SELECT * FROM receipts WHERE bill_id = ?`, [bill_id]);

        if (existing.length > 0) {
          return res.json(existing[0]);
        }
      const [result] = await db.promise().query(
        `INSERT INTO receipts (receipt_number, account_number, user_id, payment_method, amount, bill_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [receipt_number, account_number, user_id, payment_method, amount, bill_id]
      );
  
      const receiptId = result.insertId;
  
      await db.promise().query(
        `UPDATE Bills SET status = 'paid' WHERE bill_id = ?`,
        [bill_id]
      );
  
      const [rows] = await db.promise().query(
        `SELECT * FROM receipts WHERE id = ?`,
        [receiptId]
      );
      console.log("Updating bill with ID:", bill_id);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Failed to save receipt:", error);
      res.status(500).json({ error: 'Failed to save receipt' });
    }
  };
  
  const getReceiptsByUser = async (req, res) => {
    const userId = req.params.user_id;
    try {
      const receipts = await db.promise().query('SELECT * FROM receipts WHERE user_id = ?', [userId]);
      res.status(200).json(receipts[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch receipts' });
    }
  };


  const getPendingBillsCount = async (req,res) => {
    try{
        const query = `SELECT COUNT(*) AS count FROM Bills WHERE status = 'unpaid'`;
        db.query(query, (err, results) => {
          if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Database error" });
          }
          return res.json(results);
      });
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getLatestBills = async (req, res) => {
    try {
      const query = `SELECT * FROM Bills ORDER BY bill_id DESC LIMIT 5`;
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching latest bills:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json(results);
      });
    } catch (error) {
      console.error('Error fetching latest bills:', error);
    }
  };
  
const fetchPaidBills = async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const query = `SELECT * FROM Bills WHERE user_id = ? AND status = 'paid'`;
      db.query(query, [user_id], (err, results) => {
        if (err) {
          console.error('Error fetching paid bills:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json(results);
      });
    } catch (error) {
      console.error('Error fetching paid bills:', error);
    }
  };

module.exports = {getPendingBills ,getAllBills,fetchBillDetails, receipt, getReceiptsByUser ,getPendingBillsCount , getLatestBills, fetchPaidBills};
