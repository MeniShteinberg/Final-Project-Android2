const Post = require('../models/post');
const User = require('../models/user');

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

    const formatted = stats.map(entry => ({
      date: entry._id,
      count: entry.count
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to generate post stats:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserStats = async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const stats = await User.aggregate([
      { $match: { createdAt: { $gte: oneMonthAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    console.error('Failed to generate user stats:', err.message);
    res.status(500).json({ error: err.message });
  }
};
