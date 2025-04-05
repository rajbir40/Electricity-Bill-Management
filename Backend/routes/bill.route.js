const express = require('express');

const router = express.Router();
const {getAllBills} = require('../controller/bill.controller.js');

router.get('/get-bills', getAllBills);


module.exports = router;