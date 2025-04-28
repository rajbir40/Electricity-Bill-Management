const db = require("../lib/db");
const nodemailer = require("nodemailer");

const getUser = async (req, res) => {
  const meterid = req.query.meterid;
  const sql =
    "SELECT U.user_id, U.fullName, U.email, U.phone, M.meter_id, M.meter_type FROM Users U JOIN Meters M ON U.user_id = M.user_id WHERE M.meter_id = ?;";

  try {
    db.query(sql, meterid, (err, results) => {
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

// <-- Step 1

const createNewBill = async (req, res) => {
  try {
    const { meter_id, units_consumed, total_amount, billing_month, due_date } =
      req.body;

    if (
      !meter_id ||
      units_consumed === undefined ||
      !total_amount ||
      !billing_month ||
      !due_date
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

      const insertBillQuery = `
        INSERT INTO Bills (user_id, meter_id, billing_month, units_consumed, total_amount, due_date)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      db.query(
        insertBillQuery,
        [
          user_id,
          meter_id,
          billing_month,
          units_consumed,
          total_amount,
          due_date,
        ],
        (err, insertResult) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          // Create the notification message
          const message = `Your bill for ${billing_month} has been generated and is due on ${due_date}.`;

          // Insert notification into the Notifications table
          const insertNotificationQuery = `
            INSERT INTO Notifications (user_id, message)
            VALUES (?, ?);
          `;
          db.query(
            insertNotificationQuery,
            [user_id, message],
            (err, notifResult) => {
              if (err) {
                // Log the error but do not block the bill generation response
                console.error("Notification creation error:", err);
              }
            }
          );

          return res.status(201).json({
            message: "Bill generated successfully",
            billId: insertResult.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error generating bill:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const sendReminder = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT b.bill_id, b.user_id, b.due_date, b.total_amount, u.email, u.phone
            FROM Bills b
            JOIN Users u ON b.user_id = u.user_id
            WHERE b.due_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 10 DAY
            AND b.status = 'unpaid'`
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No bills found" });
    }

    console.log("Bills to notify:", rows);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const row of rows) {
      console.log(`Preparing to send email to: ${row.email}`);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: row.email,
        subject: "Bill Reminder",
        text: `Your bill for the month of ${row.billing_month} has not been paid. Please pay the bill by ${row.due_date}.`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${row.email}: ${info.response}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${row.email}:`, error);
      }
    }

    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMeterDetails = async (req, res) => {
  try {
    const sql =
      "SELECT  M.meter_id as meter_id, M.meter_number AS MeterNumber, U.fullName AS FullName, U.address AS Address, M.meter_type AS MeterType FROM Meters M JOIN Users U ON M.user_id = U.user_id;";
    db.query(sql, (err, results) => {
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

const generateBill = async (req, res) => {
  try {
    const { meterNumber, unitsConsumed } = req.body.payload;
    // console.log(meterNumber);
    if (!meterNumber || !unitsConsumed)
      return res.status(400).json({ error: "Missing required fields" });

    const billingDate = new Date().toISOString().slice(0, 10); // '2025-04-09'

    await db
      .promise()
      .query("CALL generateMonthlyBill(?, ?, ?)", [
        meterNumber,
        unitsConsumed,
        billingDate,
      ]);

    res.status(200).json({ message: "Bill generated successfully" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const query =
      "SELECT  YEAR(payment_date) AS year, MONTH(payment_date) AS month, SUM(amount_paid) AS total_amount FROM payments GROUP BY YEAR(payment_date), MONTH(payment_date) ORDER BY YEAR(payment_date), MONTH(payment_date);";
    db.query(query, (err, results) => {
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

const getConsumptionDetails = async (req, res) => {
  try {
    const query =
      "SELECT SUM(CASE WHEN m.meter_type = 'residential' THEN b.units_consumed ELSE 0 END) AS residential, SUM(CASE WHEN m.meter_type = 'commercial' THEN b.units_consumed ELSE 0 END) AS commercial, SUM(CASE WHEN m.meter_type = 'industrial' THEN b.units_consumed ELSE 0 END) AS industrial FROM Bills b JOIN Meters m ON b.meter_id = m.meter_id;";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      return res.json(results[0]);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addNewMeter = async (req, res) => {
  try {
    const { meterNumber, meterType, user_id } = req.body;
    
    console.log("Received:", req.body);

    if (!meterNumber || !meterType || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // console.log("Received:", req.body);

    const query = `
      INSERT INTO Meters (user_id, meter_number, meter_type)
      VALUES (?, ?, ?)
    `;

    db.query(query, [user_id, meterNumber, meterType], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      return res.status(201).json({
        message: "Meter registered successfully",
        meterId: results.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  getUser,
  createNewBill,
  sendReminder,
  generateBill,
  getMeterDetails,
  getMonthlyRevenue,
  getConsumptionDetails,
  addNewMeter,
};
