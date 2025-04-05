const express = require('express');
const router = express.Router();
const { recordPayment, unpaidBills, payBill } = require('../controller/payment.controller');

router.post('/record', recordPayment);
router.post('/bills', unpaidBills);
router.post('/pay',payBill);

module.exports = router;