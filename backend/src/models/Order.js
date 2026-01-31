const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Kredi Kartı', 'Banka Kartı', 'Havale/EFT', 'Kapıda Ödeme']
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  cargoCompany: {
    type: String,
    default: ''
  },
  trackingNumber: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

// Sipariş numarası otomatik oluştur
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear()
    const count = await this.constructor.countDocuments()
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)