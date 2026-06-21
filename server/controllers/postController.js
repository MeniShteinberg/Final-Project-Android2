const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = async (req, res) => {
  const { content, postedBy, group } = req.body;

  if (!content || !postedBy) {
    return res.status(400).json({ message: 'Missing content or user' });
  }

  if (group) {
    return res.status(400).json({ message: 'Cannot create group post via feed endpoint' });
  }

  try {
    const newPost = new Post({
      content,
      postedBy,
      photo: req.file
        ? { url: req.file.path, public_id: req.file.filename }
        : { url: '', public_id: '' },
    });

    await newPost.save();
    res.json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "name username photo")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = stats.map(entry => ({ date: entry._id, count: entry.count }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.likePost = async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo");

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.commentOnPost = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, postedBy: userId, createdAt: new Date() });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo");

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const { content, userId } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.postedBy.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

    post.content = content;
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo");

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isOwner = post.postedBy.toString() === userId;
    const isAdmin = user.role === 'Admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(post._id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createGroupPost = async (req, res) => {
  try {
    const { content, postedBy } = req.body;
    const groupId = req.params.groupId;

    const newPost = new Post({
      content,
      postedBy,
      group: groupId,
      photo: req.file
        ? { url: req.file.path, public_id: req.file.filename }
        : { url: '', public_id: '' },
    });

    await newPost.save();
    await require('../models/group').findByIdAndUpdate(groupId, {
      $push: { posts: newPost._id },
    });

    const populated = await Post.findById(newPost._id)
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo");

    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating group post:', err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const me = await User.findById(req.params.userId);
    if (!me) return res.status(404).json({ message: 'User not found' });


    const followingIds = [...me.following, me._id];


    const myGroups = await require('../models/group').find({ members: me._id }).select('_id');
    const myGroupIds = myGroups.map(g => g._id);


    const posts = await Post.find({
      $or: [
        { postedBy: { $in: followingIds }, group: null },
        { group: { $in: myGroupIds } }
      ]
    })
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error in getFeed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
