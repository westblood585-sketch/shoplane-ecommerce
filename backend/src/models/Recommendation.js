const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Recommendation tipleri
  type: {
    type: String,
    enum: [
      'collaborative', // Benzer kullanıcılar
      'content_based', // Ürün özellikleri
      'frequently_bought_together', // Sık birlikte alınanlar
      'trending', // Trendler
      'personalized', // Kişiselleştirilmiş
      'similar_products' // Benzer ürünler
    ],
    required: true
  },
  
  // Önerilen ürünler (sıralı)
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    score: Number, // Öneri skoru
    reason: String // Öneri sebebi
  }],
  
  // Context
  basedOnProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  basedOnCategory: String,
  basedOnBehavior: String,
  
  // Metadata
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 saat
  },
  
  // Performance tracking
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index
recommendationSchema.index({ user: 1, type: 1 })
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
recommendationSchema.index({ user: 1, basedOnProduct: 1 })

// Virtual: CTR (Click Through Rate)
recommendationSchema.virtual('ctr').get(function() {
  return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0
})

// Virtual: Conversion Rate
recommendationSchema.virtual('conversionRate').get(function() {
  return this.clicks > 0 ? (this.conversions / this.clicks) * 100 : 0
})

module.exports = mongoose.model('Recommendation', recommendationSchema)