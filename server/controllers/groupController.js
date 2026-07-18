// Load the group and user models for community management.
const Group = require('../models/group');
const User = require('../models/user');

// Create a new group with the creator as the first member and admin.
exports.createGroup = async (req, res) => {
    try {
        const { name, description, category, isPrivate, userId } = req.body;

        const photo = req.file
            ? {
                url: req.file.path,
                public_id: req.file.filename,
            }
            : undefined;

        const group = new Group({
            name,
            description,
            category,
            isPrivate,
            photo,
            members: [userId],
            admins: [userId],
        });

        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create group', error: err.message });
    }
};



// Return all groups for discovery and browsing.
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({});
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
    }
};

// Remove a user from a group's member list.
exports.unfollowGroup = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        group.members = group.members.filter((id) => id.toString() !== userId);
        await group.save();

        res.status(200).json({ message: 'Left group successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to leave group', error: err.message });
    }
};


// Add a user to a group when they follow it.
exports.followGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        res.json(group);
    } catch (err) {
        res.status(500).json({ message: 'Failed to follow group', error: err.message });
    }
};

// Return the groups that a specific user joined.
exports.getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;
        const groups = await Group.find({ members: userId });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get groups', error: err.message });
    }
};

exports.unfollowGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter((id) => id.toString() !== userId);
    await group.save();

    res.json({ message: 'User unfollowed group' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow group', error: err.message });
  }
};
