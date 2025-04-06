const express = require('express');
const router = express.Router();

const { getAllUsers  , getBillingHistory , getUser, updateUser} = require('../controller/user.controller');

router.get('/all-user', getAllUsers);
router.get('/billing-history', getBillingHistory);
router.get('/get/:user_id', getUser);
router.put('/update/:user_id', updateUser);
module.exports = router;
