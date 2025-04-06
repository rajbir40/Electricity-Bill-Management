const express = require('express');
const router = express.Router();
const {getPendingBills , getAllBills} = require('../controller/bill.controller');

router.get('/get-bills', getAllBills);
router.get('/due-bills/:user_id', getPendingBills);

module.exports = router;
