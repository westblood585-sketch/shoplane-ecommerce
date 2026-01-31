const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori adı gereklidir'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)