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

const createNewBill = async (req, res) => {
    try {
      // Extract data from the request body
      const { meter_id, units_consumed, total_amount, billing_month, due_date } = req.body;
  
      // Validate that all required fields are provided
      if (!meter_id || units_consumed === undefined || !total_amount || !billing_month || !due_date) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // 1. Retrieve the user ID for the given meter_id from the Meters table
      const getUserQuery = "SELECT user_id FROM Meters WHERE meter_id = ?;";
      db.query(getUserQuery, [meter_id], (err, userResults) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        if (userResults.length === 0) {
          return res.status(404).json({ error: "Meter not found" });
        }
        
        const user_id = userResults[0].user_id;
  
        // 2. Insert a new bill into the Bills table
        const insertBillQuery = `
          INSERT INTO Bills (user_id, meter_id, billing_month, units_consumed, total_amount, due_date)
          VALUES (?, ?, ?, ?, ?, ?);
        `;
        
        db.query(
          insertBillQuery,
          [user_id, meter_id, billing_month, units_consumed, total_amount, due_date],
          (err, insertResult) => {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Database error" });
            }
            
            // Bill created successfully; respond with the new bill's ID
            return res.status(201).json({ 
              message: "Bill generated successfully", 
              billId: insertResult.insertId 
            });
          }
        );
      });
    } catch (error) {
      console.error("Error generating bill:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
module.exports = {getUser , createNewBill} ;