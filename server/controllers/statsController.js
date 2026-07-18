// Load the models needed to build statistics reports.
const Post = require('../models/post');
const User = require('../models/user');

// Aggregate post counts by day for the charts.
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

// Aggregate user registrations over the recent period.
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
