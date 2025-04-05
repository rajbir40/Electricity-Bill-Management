const express = require('express');

const router = express.Router();

const {signup, login, forgotpassword, verifyOTP, resetPassword,checkingAuth} = require('../controller/auth.controller');
const {authMiddleware} = require("../middleware/auth.middleware")

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotpassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/check',authMiddleware,checkingAuth);

module.exports = router;
