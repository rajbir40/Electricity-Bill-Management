const express = require('express');
const router = express.Router();

const { getallnotifi} = require('../controller/notifi.controller');

router.get('/all-notifi', getallnotifi);

module.exports = router;
