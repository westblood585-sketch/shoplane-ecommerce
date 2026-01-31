const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Kupon kodu gereklidir'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: [true, 'İndirim oranı gereklidir'],
    min: 0,
    max: 100
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null = sınırsız
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Kupon geçerli mi?
couponSchema.methods.isValid = function() {
  const now = new Date()
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  )
}

module.exports = mongoose.model('Coupon', couponSchema)