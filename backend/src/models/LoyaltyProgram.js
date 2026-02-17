const mongoose = require('mongoose')

const loyaltyProgramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Points
  points: {
    current: {
      type: Number,
      default: 0
    },
    lifetime: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  
  // Tier/Level
  tier: {
    current: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    },
    pointsToNextTier: {
      type: Number,
      default: 1000
    },
    benefits: [{
      type: String,
      description: String
    }]
  },
  
  // Point history
  transactions: [{
    type: {
      type: String,
      enum: ['earn', 'redeem', 'expire', 'bonus', 'refund', 'adjustment'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: String,
    
    // Related entities
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    
    // Point lifecycle
    earnedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    expired: {
      type: Boolean,
      default: false
    },
    
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Rewards redeemed
  redeemedRewards: [{
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    pointsSpent: Number,
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    code: String,
    used: {
      type: Boolean,
      default: false
    },
    usedAt: Date,
    expiresAt: Date
  }],
  
  // Referrals
  referrals: {
    code: {
      type: String,
      unique: true,
      sparse: true
    },
    totalReferrals: {
      type: Number,
      default: 0
    },
    successfulReferrals: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  },
  
  // Streaks & Achievements
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: Date
  },
  
  achievements: [{
    type: String,
    name: String,
    description: String,
    earnedAt: Date,
    points: Number
  }],
  
  // Stats
  stats: {
    totalEarned: {
      type: Number,
      default: 0
    },
    totalRedeemed: {
      type: Number,
      default: 0
    },
    totalExpired: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index - user already has unique index from field definition
// referrals.code already has unique index from field definition
loyaltyProgramSchema.index({ 'tier.current': 1 })

// Virtual: Points expiring soon (30 days)
loyaltyProgramSchema.virtual('expiringPoints').get(function() {
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  
  return this.transactions
    .filter(t => 
      t.type === 'earn' && 
      !t.expired && 
      t.expiresAt && 
      t.expiresAt <= thirtyDaysFromNow
    )
    .reduce((sum, t) => sum + t.points, 0)
})

// Methods
loyaltyProgramSchema.methods.earnPoints = function(points, description, orderId = null, expiresInDays = 365) {
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
  
  this.transactions.push({
    type: 'earn',
    points,
    description,
    order: orderId,
    expiresAt
  })
  
  this.points.current += points
  this.points.lifetime += points
  this.stats.totalEarned += points
  
  // Check tier upgrade
  this.checkTierUpgrade()
  
  return this.save()
}

loyaltyProgramSchema.methods.redeemPoints = function(points, description, rewardId = null) {
  if (this.points.current < points) {
    throw new Error('Insufficient points')
  }
  
  this.transactions.push({
    type: 'redeem',
    points: -points,
    description,
    reward: rewardId
  })
  
  this.points.current -= points
  this.stats.totalRedeemed += points
  
  return this.save()
}

loyaltyProgramSchema.methods.expirePoints = async function() {
  const now = new Date()
  let expiredPoints = 0
  
  this.transactions.forEach(transaction => {
    if (
      transaction.type === 'earn' &&
      !transaction.expired &&
      transaction.expiresAt &&
      transaction.expiresAt <= now
    ) {
      transaction.expired = true
      expiredPoints += transaction.points
    }
  })
  
  if (expiredPoints > 0) {
    this.points.current = Math.max(0, this.points.current - expiredPoints)
    this.stats.totalExpired += expiredPoints
    
    this.transactions.push({
      type: 'expire',
      points: -expiredPoints,
      description: 'Points expired'
    })
  }
  
  return this.save()
}

loyaltyProgramSchema.methods.checkTierUpgrade = function() {
  const tiers = {
    bronze: { min: 0, max: 999, benefits: ['1x points', 'Birthday bonus'] },
    silver: { min: 1000, max: 4999, benefits: ['1.5x points', 'Free shipping', 'Birthday bonus'] },
    gold: { min: 5000, max: 14999, benefits: ['2x points', 'Free shipping', 'Early access', 'Birthday bonus'] },
    platinum: { min: 15000, max: 49999, benefits: ['2.5x points', 'Free shipping', 'Early access', 'Priority support', 'Birthday bonus'] },
    diamond: { min: 50000, max: Infinity, benefits: ['3x points', 'Free shipping', 'VIP access', 'Priority support', 'Exclusive deals', 'Birthday bonus'] }
  }
  
  const lifetimePoints = this.points.lifetime
  let newTier = 'bronze'
  
  for (const [tier, config] of Object.entries(tiers)) {
    if (lifetimePoints >= config.min && lifetimePoints <= config.max) {
      newTier = tier
      break
    }
  }
  
  const tierChanged = this.tier.current !== newTier
  
  if (tierChanged) {
    this.tier.current = newTier
    this.tier.benefits = tiers[newTier].benefits.map(b => ({ type: b }))
  }
  
  // Calculate points to next tier
  const currentTierIndex = Object.keys(tiers).indexOf(newTier)
  const nextTierName = Object.keys(tiers)[currentTierIndex + 1]
  
  if (nextTierName) {
    this.tier.pointsToNextTier = tiers[nextTierName].min - lifetimePoints
  } else {
    this.tier.pointsToNextTier = 0 // Max tier reached
  }
  
  return tierChanged
}

loyaltyProgramSchema.methods.updateStreak = function() {
  const now = new Date()
  const lastPurchase = this.streaks.lastPurchaseDate
  
  if (!lastPurchase) {
    this.streaks.current = 1
    this.streaks.lastPurchaseDate = now
  } else {
    const daysSinceLastPurchase = Math.floor((now - lastPurchase) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLastPurchase <= 7) {
      // Continue streak
      this.streaks.current += 1
      this.streaks.lastPurchaseDate = now
      
      if (this.streaks.current > this.streaks.longest) {
        this.streaks.longest = this.streaks.current
      }
    } else {
      // Streak broken
      this.streaks.current = 1
      this.streaks.lastPurchaseDate = now
    }
  }
  
  // Streak bonuses
  if (this.streaks.current % 5 === 0) {
    const bonus = this.streaks.current * 10
    this.earnPoints(bonus, `${this.streaks.current}-purchase streak bonus!`)
  }
  
  return this.save()
}

loyaltyProgramSchema.methods.checkAchievements = async function() {
  const achievements = [
    {
      id: 'first_purchase',
      name: 'First Purchase',
      description: 'Make your first purchase',
      condition: () => this.stats.totalOrders >= 1,
      points: 100
    },
    {
      id: 'loyal_customer',
      name: 'Loyal Customer',
      description: 'Make 10 purchases',
      condition: () => this.stats.totalOrders >= 10,
      points: 500
    },
    {
      id: 'big_spender',
      name: 'Big Spender',
      description: 'Spend 10,000₺',
      condition: () => this.stats.totalSpent >= 10000,
      points: 1000
    },
    {
      id: 'point_collector',
      name: 'Point Collector',
      description: 'Earn 5,000 points',
      condition: () => this.points.lifetime >= 5000,
      points: 500
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: '10-purchase streak',
      condition: () => this.streaks.longest >= 10,
      points: 1000
    }
  ]
  
  let newAchievements = []
  
  for (const achievement of achievements) {
    const alreadyEarned = this.achievements.some(a => a.type === achievement.id)
    
    if (!alreadyEarned && achievement.condition()) {
      this.achievements.push({
        type: achievement.id,
        name: achievement.name,
        description: achievement.description,
        earnedAt: Date.now(),
        points: achievement.points
      })
      
      this.earnPoints(achievement.points, `Achievement: ${achievement.name}`)
      newAchievements.push(achievement)
    }
  }
  
  if (newAchievements.length > 0) {
    await this.save()
  }
  
  return newAchievements
}

loyaltyProgramSchema.methods.getPointsMultiplier = function() {
  const multipliers = {
    bronze: 1,
    silver: 1.5,
    gold: 2,
    platinum: 2.5,
    diamond: 3
  }
  
  return multipliers[this.tier.current] || 1
}

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema)