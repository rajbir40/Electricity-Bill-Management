const express = require('express');
const router = express.Router();
const {getPendingBills , getAllBills , fetchBillDetails, receipt, getReceiptsByUser} = require('../controller/bill.controller');

router.get('/get-bills', getAllBills);
router.get('/due-bills/:user_id', getPendingBills);
router.get('/fetch/:bill_id', fetchBillDetails);
router.post('/receipt',receipt);
router.get('/receipt/:user_id', getReceiptsByUser);
module.exports = router;
