// Load the messaging router and controller handlers.
const express = require('express');
const {
  sendMessage,
  getConversation
} = require('../controllers/messageController');

const router = express.Router();

// Send a new message for the current conversation.
router.post('/', sendMessage);

// Retrieve the chat history between two users.
router.get('/:user1/:user2', getConversation);

module.exports = router;