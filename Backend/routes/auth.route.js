const express = require('express');

const router = express.Router();

const {signup, login, forgotpassword, verifyOTP, resetPassword} = require('../controller/auth.controller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotpassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
module.exports = router;
