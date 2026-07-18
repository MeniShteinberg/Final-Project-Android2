const express = require('express');
const { upload } = require('../utils/cloudinary');
const {
  registerUser,
  loginUser
} = require('../controllers/authController');

// Create the authentication router.
const router = express.Router();
// Register the user creation endpoint with photo upload support.
router.post('/register', upload.single('photo'), registerUser);

// Register the credentials-based login endpoint.
router.post('/login', loginUser);

module.exports = router;
