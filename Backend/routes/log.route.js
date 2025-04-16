const express = require('express');
const router = express.Router();

const {getLogs} = require('../controller/log.controller');

router.get('/fetch', getLogs);

module.exports = router;
