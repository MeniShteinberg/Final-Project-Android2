// Load the stats router and controller handlers.
const express = require('express');
const { getPostStats, getUserStats } = require('../controllers/statsController');

const router = express.Router();

// Return post growth statistics.
router.get('/posts', getPostStats);

// Return user growth statistics.
router.get('/users', getUserStats);

module.exports = router;
