const mongoose = require('mongoose')

const experimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  
  // Experiment type
  type: {
    type: String,
    enum: ['ab', 'multivariate', 'split_url'],
    default: 'ab'
  },
  
  // Target
  targetUrl: String,
  targetElement: String, // CSS selector
  targetPage: {
    type: String,
    enum: ['home', 'product', 'cart', 'checkout', 'all'],
    default: 'all'
  },
  
  // Variants
  variants: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    traffic: {
      type: Number,
      default: 50, // Percentage
      min: 0,
      max: 100
    },
    changes: mongoose.Schema.Types.Mixed, // JSON of changes
    isControl: {
      type: Boolean,
      default: false
    },
    
    // Variant stats
    stats: {
      impressions: {
        type: Number,
        default: 0
      },
      conversions: {
        type: Number,
        default: 0
      },
      revenue: {
        type: Number,
        default: 0
      },
      bounceRate: {
        type: Number,
        default: 0
      },
      avgTimeOnPage: {
        type: Number,
        default: 0
      }
    }
  }],
  
  // Goals
  primaryGoal: {
    type: {
      type: String,
      enum: ['click', 'purchase', 'signup', 'addToCart', 'custom'],
      required: true
    },
    element: String, // CSS selector for click tracking
    eventName: String // For custom events
  },
  secondaryGoals: [{
    type: String,
    element: String,
    eventName: String
  }],
  
  // Targeting
  audience: {
    targeting: {
      type: String,
      enum: ['all', 'new_visitors', 'returning_visitors', 'segment'],
      default: 'all'
    },
    countries: [String],
    devices: [String], // mobile, tablet, desktop
    browsers: [String],
    customSegment: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'running', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  
  // Schedule
  startDate: Date,
  endDate: Date,
  
  // Settings
  settings: {
    sampleSize: Number, // Minimum sample size
    confidenceLevel: {
      type: Number,
      default: 95 // 95% confidence
    },
    trafficAllocation: {
      type: Number,
      default: 100 // Percentage of total traffic
    },
    autoSelectWinner: {
      type: Boolean,
      default: false
    }
  },
  
  // Results
  results: {
    winner: String, // Variant name
    confidence: Number,
    uplift: Number, // Percentage improvement
    completedAt: Date,
    notes: String
  },
  
  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Index
experimentSchema.index({ status: 1, targetPage: 1 })
experimentSchema.index({ createdBy: 1 })
experimentSchema.index({ startDate: 1, endDate: 1 })

// Virtual: Is running
experimentSchema.virtual('isRunning').get(function() {
  const now = new Date()
  return this.status === 'running' && 
         (!this.startDate || this.startDate <= now) &&
         (!this.endDate || this.endDate >= now)
})

// Virtual: Total impressions
experimentSchema.virtual('totalImpressions').get(function() {
  return this.variants.reduce((sum, v) => sum + v.stats.impressions, 0)
})

// Virtual: Total conversions
experimentSchema.virtual('totalConversions').get(function() {
  return this.variants.reduce((sum, v) => sum + v.stats.conversions, 0)
})

// Methods
experimentSchema.methods.selectVariant = function(userId = null) {
  if (this.status !== 'running') return null
  
  // Traffic allocation check
  const random = Math.random() * 100
  if (random > this.settings.trafficAllocation) {
    return null
  }
  
  // Weighted random selection
  const totalWeight = this.variants.reduce((sum, v) => sum + v.traffic, 0)
  let selection = Math.random() * totalWeight
  
  for (const variant of this.variants) {
    selection -= variant.traffic
    if (selection <= 0) {
      return variant
    }
  }
  
  return this.variants[0]
}

experimentSchema.methods.calculateConversionRate = function(variantName) {
  const variant = this.variants.find(v => v.name === variantName)
  if (!variant || variant.stats.impressions === 0) return 0
  
  return (variant.stats.conversions / variant.stats.impressions) * 100
}

experimentSchema.methods.calculateStatisticalSignificance = function() {
  if (this.variants.length !== 2) return null // Only for A/B tests
  
  const [control, variant] = this.variants
  
  const p1 = control.stats.conversions / control.stats.impressions
  const p2 = variant.stats.conversions / variant.stats.impressions
  
  const pooledP = (control.stats.conversions + variant.stats.conversions) / 
                   (control.stats.impressions + variant.stats.impressions)
  
  const se = Math.sqrt(pooledP * (1 - pooledP) * 
                       (1/control.stats.impressions + 1/variant.stats.impressions))
  
  const zScore = (p2 - p1) / se
  
  // P-value calculation (simplified)
  const pValue = 1 - (0.5 * (1 + Math.erf(Math.abs(zScore) / Math.sqrt(2))))
  
  return {
    zScore,
    pValue,
    isSignificant: pValue < 0.05,
    confidence: (1 - pValue) * 100
  }
}

module.exports = mongoose.model('Experiment', experimentSchema)