const express = require('express');
const router = express.Router();
const { 
    getMyOrders, 
    createOrder, 
    getReceivedGifts, 
    getReceivedGiftCount,
    claimGift,
    sendGratitude,
    getUnreadNotifications,
    getNotificationList, 
    markNotificationsRead
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

// Standard Order Routes
router.get('/', protect, getMyOrders);
router.post('/', protect, createOrder);

// Gift Ritual Specific Routes
router.get('/received', protect, getReceivedGifts);
router.get('/received/count', protect, getReceivedGiftCount);

// FIXED: This now matches the frontend PUT call perfectly
router.put('/received/:id/claim', protect, claimGift);

// Gratitude & Notification Routes
router.post('/thank/:id', protect, sendGratitude);
router.get('/notifications/unread', protect, getUnreadNotifications);

// Updated: Matches the 'list-detailed' fetch call in Navbar.jsx
router.get('/notifications/list-detailed', protect, getNotificationList);

router.put('/notifications/read-all', protect, markNotificationsRead);

module.exports = router;