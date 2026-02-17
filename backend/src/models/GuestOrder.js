const mongoose = require('mongoose')

const guestOrderSchema = new mongoose.Schema({
  // Guest bilgileri
  guestEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  guestName: {
    type: String,
    required: true
  },
  guestPhone: {
    type: String,
    required: true
  },
  
  // Sipariş bilgileri (Order model ile aynı)
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    district: String,
    zipCode: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'kapida_odeme'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingUrl: String,
  
  // Misafir sipariş takip token (email ile kontrol için)
  trackingToken: {
    type: String,
    required: true,
    unique: true
  },
  
  // Marketing
  acceptsMarketing: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index
guestOrderSchema.index({ guestEmail: 1, orderNumber: 1 })
guestOrderSchema.index({ trackingToken: 1 })

module.exports = mongoose.model('GuestOrder', guestOrderSchema)