const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  sender: {
    type: String,
    enum: ['user', 'ai']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema); 