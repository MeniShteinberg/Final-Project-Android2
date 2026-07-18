const express = require('express');
// Create the feed router.
const router = express.Router();
const { getUserFeed } = require('../controllers/feedController');

// Return the personalized feed for a specific user.
router.get('/:userId', getUserFeed);

module.exports = router;
