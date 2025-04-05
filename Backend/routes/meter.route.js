const express = require('express');
const router = express.Router();
const {getUser , createNewBill , sendReminder} = require('../controller/meter.controller'); 

router.get('/get-user', getUser);
router.post('/generate-bill' , createNewBill);
router.get('/send-reminder' , sendReminder);


module.exports = router;
