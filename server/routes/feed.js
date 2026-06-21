const express = require('express');
const router = express.Router();
const { getUserFeed } = require('../controllers/feedController');

router.get('/:userId', getUserFeed);

module.exports = router;
