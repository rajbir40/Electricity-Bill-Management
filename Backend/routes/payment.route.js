const express = require('express');
const router = express.Router();
const { recordPayment } = require('../controller/payment.controller');

router.post('/record', recordPayment);

module.exports = router;