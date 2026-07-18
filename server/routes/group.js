const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const postController = require('../controllers/postController');
const { upload } = require('../utils/cloudinary');
const Group = require('../models/group');
const Post = require('../models/post');

router.post('/create', upload.single('photo'), groupController.createGroup);

router.get('/', groupController.getAllGroups);
router.post('/:groupId/follow', groupController.followGroup);

router.get('/user/:userId', groupController.getUserGroups);


router.get('/:groupId', async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch group', error: err.message });
    }
});


router.get('/:groupId/posts', async (req, res) => {
    try {
        const posts = await Post.find({ group: req.params.groupId })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'username name photo')
            .populate('comments.postedBy', 'username name photo');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch group posts', error: err.message });
    }
});

router.post('/:groupId/post', upload.single('photo'), postController.createGroupPost);

router.post('/:groupId/unfollow', groupController.unfollowGroup);


module.exports = router;
