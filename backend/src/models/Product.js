const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gereklidir']
  },
  price: {
    type: Number,
    required: [true, 'Ürün fiyatı gereklidir'],
    min: 0
  },
  oldPrice: {
    type: Number,
    default: null
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['Elektronik', 'Aksesuar', 'Ayakkabı', 'Giyim', 'Ev & Yaşam', 'Spor', 'Kitap', 'Oyuncak']
  },
  brand: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  colors: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  features: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Text search için index
productSchema.index({ name: 'text', description: 'text', brand: 'text' })

module.exports = mongoose.model('Product', productSchema)