
const Post = require('../models/post');
const User = require('../models/user');

exports.getUserFeed = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const followingIds = user.following.map(id => id.toString());
    followingIds.push(user._id.toString());

    const posts = await Post.find({
      postedBy: { $in: followingIds },
      group: null
    })
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Failed to fetch feed:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};