const express = require('express');
const router = express.Router();


const {getUser} = require('../controller/meter.controller'); 
router.get('/get-user', getUser);


module.exports = router;
