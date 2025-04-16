const express = require('express');
const router = express.Router();
const { recordPayment, unpaidBills, payBill ,getTotalRevenue , getDueAmount , getPaymentReport} = require('../controller/payment.controller');

router.post('/record', recordPayment);
router.post('/bills', unpaidBills);
router.post('/pay',payBill);
router.get('/revenue',getTotalRevenue);
router.get('/due-amount',getDueAmount);
router.get('/report',getPaymentReport);

module.exports = router;