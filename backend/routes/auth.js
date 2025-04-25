const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { auth } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);

module.exports = router; 