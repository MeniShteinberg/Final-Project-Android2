const express = require('express');
const { upload } = require('../utils/cloudinary');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

const router = express.Router();
router.post('/register', upload.single('photo'), registerUser);

router.post('/login', loginUser);

module.exports = router;
