const express = require('express');
const router = express.Router();

const { getallnotifi , updatenotifi} = require('../controller/notifi.controller');

router.get('/all-notifi', getallnotifi);
router.post('/update-notifi/:notifi_id', updatenotifi);

module.exports = router;

