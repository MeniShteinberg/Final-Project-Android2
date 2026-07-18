const express = require('express');
const { upload } = require('../utils/cloudinary');
const {
  createPost,
  getAllPosts,
  getPostStats,
  likePost,
  commentOnPost,
  updatePost,
  deletePost,
  getFeed
} = require('../controllers/postController');

const router = express.Router();

const postController = require('../controllers/postController');

router.post('/:groupId/post', upload.single('photo'), postController.createGroupPost);

router.post('/', upload.single('photo'), createPost);

router.get('/all', getAllPosts);


router.get('/stats', getPostStats);


router.post('/:postId/like', likePost);


router.post('/:postId/comment', commentOnPost);


router.put('/:postId', updatePost);


router.delete('/:postId', deletePost);

router.get('/feed/:userId', getFeed);

module.exports = router;
