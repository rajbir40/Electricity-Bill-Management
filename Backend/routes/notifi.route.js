const express = require('express');
const router = express.Router();

const { getallnotifi , updatenotifi} = require('../controller/notifi.controller');

router.get('/all-notifi', getallnotifi);
router.put('/update-notifi', updatenotifi);

module.exports = router;

