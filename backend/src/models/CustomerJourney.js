const mongoose = require('mongoose')

const customerJourneySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  anonymousId: String,
  
  // Journey identification
  journeyId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Journey status
  status: {
    type: String,
    enum: ['active', 'converted', 'abandoned', 'churned'],
    default: 'active'
  },
  
  // Journey timeline
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  convertedAt: Date,
  
  // Touchpoints (all interactions)
  touchpoints: [{
    type: {
      type: String,
      enum: [
        'visit', 'search', 'product_view', 'add_to_cart', 
        'remove_from_cart', 'wishlist_add', 'review_read',
        'review_write', 'share', 'email_open', 'email_click',
        'chat_start', 'chat_message', 'support_ticket',
        'discount_applied', 'checkout_start', 'payment_method',
        'purchase', 'refund_request', 'review_submit'
      ],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    
    // Context
    channel: {
      type: String,
      enum: ['web', 'mobile', 'email', 'social', 'ads', 'direct'],
      default: 'web'
    },
    device: String,
    page: String,
    
    // Related entities
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    
    // Event data
    metadata: mongoose.Schema.Types.Mixed,
    
    // Sentiment (for review, chat, etc.)
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    }
  }],
  
  // Journey stages
  stages: [{
    name: {
      type: String,
      enum: ['awareness', 'consideration', 'decision', 'purchase', 'retention', 'advocacy']
    },
    enteredAt: Date,
    exitedAt: Date,
    duration: Number, // Seconds
    touchpointCount: {
      type: Number,
      default: 0
    }
  }],
  
  // Current stage
  currentStage: {
    type: String,
    enum: ['awareness', 'consideration', 'decision', 'purchase', 'retention', 'advocacy'],
    default: 'awareness'
  },
  
  // Metrics
  metrics: {
    totalTouchpoints: {
      type: Number,
      default: 0
    },
    totalDuration: Number, // Seconds
    channelMix: [{
      channel: String,
      count: Number,
      percentage: Number
    }],
    
    // Engagement score (0-100)
    engagementScore: {
      type: Number,
      default: 0
    },
    
    // Purchase intent (0-100)
    purchaseIntent: {
      type: Number,
      default: 0
    }
  },
  
  // Attribution
  firstTouch: {
    channel: String,
    source: String,
    campaign: String,
    timestamp: Date
  },
  lastTouch: {
    channel: String,
    source: String,
    campaign: String,
    timestamp: Date
  },
  
  // UTM parameters
  utmParams: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  
  // Conversion
  converted: {
    type: Boolean,
    default: false
  },
  conversionValue: Number,
  conversionType: String,
  
  // Products interacted with
  viewedProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewCount: Number,
    firstViewed: Date,
    lastViewed: Date
  }],
  
  // Cart history
  cartHistory: [{
    action: {
      type: String,
      enum: ['add', 'remove', 'update']
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    timestamp: Date
  }]
}, {
  timestamps: true,
  __versionKey: false
})

// Index
// Index - journeyId already has unique index from field definition
customerJourneySchema.index({ user: 1 })
customerJourneySchema.index({ anonymousId: 1 })
customerJourneySchema.index({ status: 1, currentStage: 1 })
customerJourneySchema.index({ lastActivityAt: -1 })

// Virtual: Journey duration
customerJourneySchema.virtual('duration').get(function() {
  const end = this.convertedAt || this.lastActivityAt || Date.now()
  return Math.floor((end - this.startedAt) / 1000)
})

// Methods
customerJourneySchema.methods.addTouchpoint = function(touchpoint) {
  this.touchpoints.push(touchpoint)
  this.lastActivityAt = Date.now()
  this.metrics.totalTouchpoints += 1
  
  // Update channel mix
  const channelIndex = this.metrics.channelMix.findIndex(
    c => c.channel === touchpoint.channel
  )
  
  if (channelIndex !== -1) {
    this.metrics.channelMix[channelIndex].count += 1
  } else {
    this.metrics.channelMix.push({
      channel: touchpoint.channel,
      count: 1,
      percentage: 0
    })
  }
  
  // Recalculate percentages
  this.metrics.channelMix.forEach(c => {
    c.percentage = (c.count / this.metrics.totalTouchpoints) * 100
  })
  
  // Update stage
  this.updateStage(touchpoint.type)
  
  // Calculate engagement score
  this.calculateEngagementScore()
  
  // Calculate purchase intent
  this.calculatePurchaseIntent()
  
  return this.save()
}

customerJourneySchema.methods.updateStage = function(touchpointType) {
  // Stage transitions based on touchpoint type
  const stageMap = {
    'visit': 'awareness',
    'search': 'awareness',
    'product_view': 'consideration',
    'add_to_cart': 'decision',
    'checkout_start': 'decision',
    'purchase': 'purchase',
    'review_submit': 'advocacy'
  }
  
  const newStage = stageMap[touchpointType]
  
  if (newStage && newStage !== this.currentStage) {
    // Close current stage
    const currentStageIndex = this.stages.findIndex(
      s => s.name === this.currentStage && !s.exitedAt
    )
    
    if (currentStageIndex !== -1) {
      const stage = this.stages[currentStageIndex]
      stage.exitedAt = Date.now()
      stage.duration = Math.floor((stage.exitedAt - stage.enteredAt) / 1000)
    }
    
    // Start new stage
    this.stages.push({
      name: newStage,
      enteredAt: Date.now(),
      touchpointCount: 1
    })
    
    this.currentStage = newStage
  } else {
    // Increment touchpoint count for current stage
    const currentStageIndex = this.stages.findIndex(
      s => s.name === this.currentStage && !s.exitedAt
    )
    
    if (currentStageIndex !== -1) {
      this.stages[currentStageIndex].touchpointCount += 1
    }
  }
}

customerJourneySchema.methods.calculateEngagementScore = function() {
  let score = 0
  
  // Base on touchpoint count (max 30 points)
  score += Math.min(this.metrics.totalTouchpoints * 2, 30)
  
  // Base on diversity of channels (max 20 points)
  score += this.metrics.channelMix.length * 5
  
  // Base on stage progression (max 30 points)
  const stageOrder = ['awareness', 'consideration', 'decision', 'purchase', 'retention', 'advocacy']
  const currentStageIndex = stageOrder.indexOf(this.currentStage)
  score += currentStageIndex * 5
  
  // Base on duration (max 20 points)
  const durationDays = this.duration / 86400
  if (durationDays < 1) score += 5
  else if (durationDays < 7) score += 10
  else if (durationDays < 30) score += 15
  else score += 20
  
  this.metrics.engagementScore = Math.min(score, 100)
}

customerJourneySchema.methods.calculatePurchaseIntent = function() {
  let intent = 0
  
  // Recent activity (last 24 hours)
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentTouchpoints = this.touchpoints.filter(
    t => t.timestamp > dayAgo
  )
  
  // High-intent touchpoints
  const highIntentTypes = ['add_to_cart', 'checkout_start', 'payment_method']
  const highIntentCount = recentTouchpoints.filter(
    t => highIntentTypes.includes(t.type)
  ).length
  
  intent += highIntentCount * 20
  
  // Product view recency
  if (recentTouchpoints.some(t => t.type === 'product_view')) {
    intent += 15
  }
  
  // Current stage
  if (this.currentStage === 'decision') intent += 25
  if (this.currentStage === 'purchase') intent += 40
  
  // Cart items
  const cartItems = this.touchpoints.filter(
    t => t.type === 'add_to_cart' && t.timestamp > dayAgo
  ).length
  intent += Math.min(cartItems * 10, 30)
  
  this.metrics.purchaseIntent = Math.min(intent, 100)
}

customerJourneySchema.methods.markConverted = function(value, type) {
  this.converted = true
  this.status = 'converted'
  this.convertedAt = Date.now()
  this.conversionValue = value
  this.conversionType = type
  
  return this.save()
}

module.exports = mongoose.model('CustomerJourney', customerJourneySchema)