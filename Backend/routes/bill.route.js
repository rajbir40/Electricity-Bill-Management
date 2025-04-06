const express = require('express');
const router = express.Router();
const {getPendingBills , getAllBills , fetchBillDetails} = require('../controller/bill.controller');

router.get('/get-bills', getAllBills);
router.get('/due-bills/:user_id', getPendingBills);
router.get('/fetch/:bill_id', fetchBillDetails);

module.exports = router;
