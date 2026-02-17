const mongoose = require('mongoose')

const userBehaviorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // View history
  viewedProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: Number, // Saniye cinsinden
    source: String // search, recommendation, direct, etc.
  }],
  
  // Search history
  searches: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    resultsCount: Number,
    clickedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  }],
  
  // Category preferences
  categoryPreferences: [{
    category: String,
    score: {
      type: Number,
      default: 0
    }
  }],
  
  // Brand preferences
  brandPreferences: [{
    brand: String,
    score: {
      type: Number,
      default: 0
    }
  }],
  
  // Price range preference
  priceRange: {
    min: Number,
    max: Number,
    average: Number
  },
  
  // Cart behavior
  cartActions: [{
    action: {
      type: String,
      enum: ['add', 'remove', 'update']
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Purchase history summary
  purchaseStats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    favoriteCategories: [String],
    favoriteBrands: [String]
  }
}, {
  timestamps: true
})

// Index
userBehaviorSchema.index({ user: 1 })
userBehaviorSchema.index({ 'viewedProducts.timestamp': -1 })
userBehaviorSchema.index({ 'searches.timestamp': -1 })

// Methods
userBehaviorSchema.methods.updateCategoryPreference = function(category, weight = 1) {
  const existing = this.categoryPreferences.find(c => c.category === category)
  
  if (existing) {
    existing.score += weight
  } else {
    this.categoryPreferences.push({ category, score: weight })
  }
  
  // Sort by score
  this.categoryPreferences.sort((a, b) => b.score - a.score)
  
  // Keep top 10
  this.categoryPreferences = this.categoryPreferences.slice(0, 10)
}

userBehaviorSchema.methods.updateBrandPreference = function(brand, weight = 1) {
  const existing = this.brandPreferences.find(b => b.brand === brand)
  
  if (existing) {
    existing.score += weight
  } else {
    this.brandPreferences.push({ brand, score: weight })
  }
  
  // Sort by score
  this.brandPreferences.sort((a, b) => b.score - a.score)
  
  // Keep top 10
  this.brandPreferences = this.brandPreferences.slice(0, 10)
}

userBehaviorSchema.methods.updatePriceRange = function(price) {
  if (!this.priceRange.min || price < this.priceRange.min) {
    this.priceRange.min = price
  }
  if (!this.priceRange.max || price > this.priceRange.max) {
    this.priceRange.max = price
  }
  
  // Calculate average (simple moving average)
  const allPrices = this.viewedProducts
    .map(v => v.product?.price)
    .filter(p => p)
  
  if (allPrices.length > 0) {
    this.priceRange.average = allPrices.reduce((a, b) => a + b, 0) / allPrices.length
  }
}

module.exports = mongoose.model('UserBehavior', userBehaviorSchema)