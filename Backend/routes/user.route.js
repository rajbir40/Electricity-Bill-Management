const express = require('express');
const router = express.Router();

const { getAllUsers  , getBillingHistory , getUser} = require('../controller/user.controller');

router.get('/all-user', getAllUsers);
router.get('/billing-history', getBillingHistory);
router.get('/get-user', getUser);

module.exports = router;
