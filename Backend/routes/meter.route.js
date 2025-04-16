const express = require("express");
const router = express.Router();
const {
  getUser,
  createNewBill,
  sendReminder,
  generateBill,
  getMeterDetails,
  getMonthlyRevenue,
  getConsumptionDetails,
  addNewMeter,
} = require("../controller/meter.controller");

router.get("/get-user", getUser);
router.post("/generate-bill", generateBill);
router.get("/send-reminder", sendReminder);
router.get("/details", getMeterDetails);
router.get("/revenue", getMonthlyRevenue);
router.get("/consumption", getConsumptionDetails);
router.post("/add", addNewMeter);

module.exports = router;
