const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const users = await User.find({});
    const dailyStats = users.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const statsArray = Object.entries(dailyStats).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(statsArray);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: '', public_id: '' };

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      photo,
    });

    await newUser.save();

    res.json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        photo: newUser.photo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username name _id photo followers');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username name')
      .populate('following', 'username name');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name username photo followers following');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ postedBy: user._id })
      .populate("postedBy", "username name photo")
      .populate("comments.postedBy", "username name photo")
      .sort({ createdAt: -1 });

    res.json({
      user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFriend = async (req, res) => {
  const { myId, friendUsername } = req.body;
  try {
    const me = await User.findById(myId);
    const friend = await User.findOne({ username: friendUsername });
    if (!me || !friend) return res.status(404).json({ message: 'User not found' });

    if (me.following.includes(friend._id)) {
      return res.status(400).json({ message: 'You already follow this user' });
    }

    me.following.push(friend._id);
    friend.followers.push(me._id);
    await me.save();
    await friend.save();

    res.json({ message: `You are now following ${friend.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  const { myId, friendId } = req.body;
  try {
    const me = await User.findById(myId);
    const friend = await User.findById(friendId);
    if (!me || !friend) return res.status(404).json({ message: 'User not found' });

    me.following = me.following.filter(id => id.toString() !== friendId);
    friend.followers = friend.followers.filter(id => id.toString() !== myId);
    await me.save();
    await friend.save();

    res.json({ message: `You unfollowed ${friend.username}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.userCrudHandler = async (req, res) => {
  const { command, data } = req.body;
  try {
    switch (command) {
      case 'insert': {
        const newUser = new User({ name: data.name, email: data.email });
        await newUser.save();
        return res.json({ message: 'User inserted successfully', user: newUser });
      }
      case 'select': {
        const users = await User.find({});
        return res.json({ message: 'Users fetched', users });
      }
      case 'update': {
        const updatedUser = await User.findByIdAndUpdate(
          data.userId,
          { email: data.newEmail },
          { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        return res.json({ message: 'User updated', user: updatedUser });
      }
      case 'delete': {
        const deletedUser = await User.findByIdAndDelete(data.userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        return res.json({ message: 'User deleted' });
      }
      default:
        return res.status(400).json({ message: 'Unknown command' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
