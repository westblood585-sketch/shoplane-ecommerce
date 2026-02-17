const mongoose = require('mongoose')

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  // Orijinal toplam fiyat
  originalPrice: {
    type: Number,
    required: true
  },
  // İndirimli fiyat
  bundlePrice: {
    type: Number,
    required: true
  },
  // İndirim yüzdesi
  discountPercent: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  // Stok (kaç adet paket var)
  stock: {
    type: Number,
    default: 100
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Virtual: Kazanç tutarı
bundleSchema.virtual('savings').get(function() {
  return this.originalPrice - this.bundlePrice
})

// Method: Aktif mi?
bundleSchema.methods.isAvailable = function() {
  const now = new Date()
  return this.isActive && 
         this.stock > 0 && 
         this.startDate <= now && 
         this.endDate >= now
}

module.exports = mongoose.model('Bundle', bundleSchema)