// Load the user routes and controller handlers.
const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const {
  registerUser,
  loginUser,
  getUserStats,
  getUserProfile,
  getUserById,
  getAllUsers,
  addFriend,
  removeFriend,
  userCrudHandler
} = require('../controllers/userController');



// Register a new user account with an optional photo.
router.post('/register', upload.single('photo'), registerUser);
// Authenticate an existing user.
router.post('/login', loginUser);
// Return user statistics for reporting.
router.get('/stats', getUserStats);
// Return a profile view for a specific user.
router.get('/:userId/profile', getUserProfile);
// Return a single user's basic information.
router.get('/:userId', getUserById);
// Return all users for discovery.
router.get('/', getAllUsers);
// Start following a specific user.
router.post('/add-friend', addFriend);
// Stop following a specific user.
router.post('/remove-friend', removeFriend);
// Handle admin CRUD requests for users.
router.post('/', userCrudHandler);


module.exports = router;
