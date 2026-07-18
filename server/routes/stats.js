const express = require('express');
const { getPostStats, getUserStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/posts', getPostStats);

router.get('/users', getUserStats);

module.exports = router;
