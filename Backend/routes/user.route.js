const express = require('express');
const router = express.Router();

const { getAllUsers  , getBillingHistory} = require('../controller/user.controller');

router.get('/all-user', getAllUsers);
router.get('/billing-history', getBillingHistory);

module.exports = router;
