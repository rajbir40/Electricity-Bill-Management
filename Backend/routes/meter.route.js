const express = require('express');
const router = express.Router();


const {getUser , createNewBill} = require('../controller/meter.controller'); 
router.get('/get-user', getUser);
router.post('/generate-bill' , createNewBill);

module.exports = router;
