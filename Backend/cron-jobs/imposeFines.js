const cron = require('node-cron');
const mysql = require('mysql2/promise');
require('dotenv').config();
// const mysql = require('mysql2/promise');
const socketService = require('../service/socketservice');

// Function to impose fines on overdue bills
 // Step 1: Import socket service

async function imposeFines() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // without quotes
    database: process.env.DB_NAME      // without quotes
  });

  try {
    // Select overdue bills with no fine applied
    const [rows] = await connection.execute(`
      SELECT b.bill_id, b.user_id, b.total_amount 
      FROM Bills b 
      LEFT JOIN Fines f ON b.bill_id = f.bill_id 
      WHERE b.due_date < CURDATE() AND f.fine_id IS NULL
    `);

    for (const bill of rows) {
      const fineAmount = bill.total_amount * 0.05;

      // Insert the fine
      await connection.execute(`
        INSERT INTO Fines (bill_id, user_id, fine_amount, fine_reason)
        VALUES (?, ?, ?, 'Overdue fine imposed automatically')
      `, [bill.bill_id, bill.user_id, fineAmount]);

      console.log(`Imposed fine of ${fineAmount} on bill ID ${bill.bill_id}`);

      // Step 2: Send real-time fine notification
      socketService.notifyFineImposed(bill.user_id.toString(), {
        fine: fineAmount,
        reason: 'Overdue fine imposed automatically',
        billId: bill.bill_id
      });
    }
  } catch (error) {
    console.error('Error imposing fines:', error);
  } finally {
    await connection.end();
  }
}


// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily fine check...');
  imposeFines().catch(console.error);
});

// Optionally, you can also run it immediately when the server starts
imposeFines().catch(console.error);
