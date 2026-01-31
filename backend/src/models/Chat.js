const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    id: String,
    sender: { type: String, enum: ['user', 'bot'] },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', chatSchema)