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



router.post('/register', upload.single('photo'), registerUser);
router.post('/login', loginUser);
router.get('/stats', getUserStats);
router.get('/:userId/profile', getUserProfile);
router.get('/:userId', getUserById);
router.get('/', getAllUsers);
router.post('/add-friend', addFriend);
router.post('/remove-friend', removeFriend);
router.post('/', userCrudHandler);


module.exports = router;
