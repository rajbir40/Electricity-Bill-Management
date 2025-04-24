const express = require('express');
const router = express.Router();

const { getAllUsers,deleteuser  , getBillingHistory , getUser, updateUser ,getUsersCount , fetchAllUsers} = require('../controller/user.controller');

router.get('/all-user', getAllUsers);
router.get('/billing-history', getBillingHistory);
router.get('/get/:user_id', getUser);
router.put('/update/:user_id', updateUser);
router.get('/count', getUsersCount);
router.get('/fetch', fetchAllUsers);
router.delete('/delete', deleteuser);
// router.put('/fetch', fetchAllUsers);

module.exports = router;
