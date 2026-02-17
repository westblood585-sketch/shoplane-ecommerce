const mongoose = require('mongoose')

const referralSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  
  // Tıklama bilgileri
  clicks: [{
    ip: String,
    userAgent: String,
    referer: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Sipariş bilgileri
  orders: [{
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    orderNumber: String,
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    orderTotal: Number,
    commission: Number,
    commissionRate: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'cancelled'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // İstatistikler
  totalClicks: {
    type: Number,
    default: 0
  },
  uniqueClicks: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalCommission: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index
referralSchema.index({ influencer: 1 })
referralSchema.index({ referralCode: 1 })
referralSchema.index({ 'orders.order': 1 })

module.exports = mongoose.model('Referral', referralSchema)