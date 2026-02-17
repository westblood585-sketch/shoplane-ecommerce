const mongoose = require('mongoose')

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  // Kim satın aldı
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Kim kullandı
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    usedAt: {
      type: Date,
      default: Date.now
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  // Hediye mesajı
  message: {
    type: String,
    default: ''
  },
  // Kime gönderildi
  recipientEmail: {
    type: String
  },
  recipientName: {
    type: String
  }
}, {
  timestamps: true
})

// Code oluşturma
giftCardSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'GC-'
  
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-'
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code // Format: GC-XXXX-XXXX-XXXX
}

// Bakiye kontrol
giftCardSchema.methods.hasBalance = function() {
  return this.balance > 0 && this.isActive && this.expiryDate > Date.now()
}

// Kullan
giftCardSchema.methods.use = function(userId, amount, orderId) {
  if (!this.hasBalance()) {
    throw new Error('Hediye kartı kullanılamaz')
  }
  
  if (amount > this.balance) {
    throw new Error('Yetersiz bakiye')
  }
  
  this.balance -= amount
  this.usedBy.push({
    user: userId,
    amount,
    order: orderId
  })
  
  if (this.balance === 0) {
    this.isActive = false
  }
  
  return this.save()
}

module.exports = mongoose.model('GiftCard', giftCardSchema)