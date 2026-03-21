const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleLogin, 
  upgradeToMember, 
  cancelMembership 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Standard Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Auth
router.post('/google-login', googleLogin);

// Membership Actions
router.put('/upgrade', protect, upgradeToMember);
router.put('/cancel', protect, cancelMembership);

module.exports = router;