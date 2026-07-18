const Message = require('../models/message');


exports.sendMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newMessage = new Message({ sender, receiver, text });
    await newMessage.save();
    res.json({ message: 'Message sent', data: newMessage });
  } catch (err) {
    console.error('Failed to save message:', err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.getConversation = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Failed to fetch messages:', err.message);
    res.status(500).json({ error: err.message });
  }
};
