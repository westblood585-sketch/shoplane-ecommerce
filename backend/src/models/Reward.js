const mongoose = require('mongoose')

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Reward type
  type: {
    type: String,
    enum: ['discount_percentage', 'discount_amount', 'free_shipping', 'free_product', 'gift_card'],
    required: true
  },
  
  // Value
  value: {
    type: Number,
    required: true
  },
  
  // Points cost
  pointsCost: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Availability
  isActive: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: -1 // -1 = unlimited
  },
  
  // Restrictions
  restrictions: {
    minPurchaseAmount: Number,
    maxDiscountAmount: Number,
    validCategories: [String],
    validProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    tierRequired: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
    }
  },
  
  // Validity
  validFrom: Date,
  validUntil: Date,
  expiresAfterDays: {
    type: Number,
    default: 30
  },
  
  // Display
  image: String,
  featured: {
    type: Boolean,
    default: false
  },
  badge: String,
  
  // Stats
  stats: {
    totalRedeemed: {
      type: Number,
      default: 0
    },
    totalUsed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Index
rewardSchema.index({ isActive: 1, featured: 1 })
rewardSchema.index({ pointsCost: 1 })

// Virtual: Is available
rewardSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false
  
  const now = new Date()
  if (this.validFrom && now < this.validFrom) return false
  if (this.validUntil && now > this.validUntil) return false
  
  if (this.stock !== -1 && this.stock <= 0) return false
  
  return true
})

// Methods
rewardSchema.methods.canRedeem = function(loyaltyProgram) {
  if (!this.isAvailable) {
    return { canRedeem: false, reason: 'Reward not available' }
  }
  
  if (loyaltyProgram.points.current < this.pointsCost) {
    return { canRedeem: false, reason: 'Insufficient points' }
  }
  
  if (this.restrictions.tierRequired) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond']
    const requiredIndex = tiers.indexOf(this.restrictions.tierRequired)
    const userIndex = tiers.indexOf(loyaltyProgram.tier.current)
    
    if (userIndex < requiredIndex) {
      return { canRedeem: false, reason: `Requires ${this.restrictions.tierRequired} tier` }
    }
  }
  
  return { canRedeem: true }
}

rewardSchema.methods.redeem = function() {
  if (this.stock !== -1) {
    this.stock -= 1
  }
  
  this.stats.totalRedeemed += 1
  
  return this.save()
}

module.exports = mongoose.model('Reward', rewardSchema)