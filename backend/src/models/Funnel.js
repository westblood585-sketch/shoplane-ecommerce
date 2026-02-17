const mongoose = require('mongoose')

const funnelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  
  // Funnel steps (in order)
  steps: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pageview', 'event', 'custom'],
      default: 'pageview'
    },
    // For pageview type
    url: String,
    urlPattern: String, // Regex pattern
    
    // For event type
    eventName: String,
    eventProperties: mongoose.Schema.Types.Mixed,
    
    // Order
    order: {
      type: Number,
      required: true
    },
    
    // Optional conditions
    conditions: [{
      field: String,
      operator: {
        type: String,
        enum: ['equals', 'contains', 'greater', 'less']
      },
      value: mongoose.Schema.Types.Mixed
    }]
  }],
  
  // Time window
  timeWindow: {
    value: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    }
  },
  
  // Analytics data
  analytics: {
    totalSessions: {
      type: Number,
      default: 0
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    avgTimeToComplete: Number, // Seconds
    avgRevenue: Number,
    
    // Per-step data
    stepData: [{
      stepIndex: Number,
      entered: Number,
      completed: Number,
      dropOff: Number,
      dropOffRate: Number,
      avgTimeOnStep: Number
    }]
  },
  
  // Segments
  segments: [{
    name: String,
    conditions: mongoose.Schema.Types.Mixed,
    analytics: mongoose.Schema.Types.Mixed
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Date range for analysis
  startDate: Date,
  endDate: Date,
  
  // Last calculated
  lastCalculated: Date
}, {
  timestamps: true
})

// Index
funnelSchema.index({ isActive: 1 })
funnelSchema.index({ name: 1 })

// Methods
funnelSchema.methods.calculateAnalytics = async function() {
  const FunnelSession = require('./FunnelSession')
  
  try {
    // Get all sessions for this funnel
    const sessions = await FunnelSession.find({
      funnel: this._id,
      ...(this.startDate && { startedAt: { $gte: this.startDate } }),
      ...(this.endDate && { startedAt: { $lte: this.endDate } })
    })

    this.analytics.totalSessions = sessions.length
    this.analytics.completedSessions = sessions.filter(s => s.completed).length
    this.analytics.conversionRate = this.analytics.totalSessions > 0
      ? (this.analytics.completedSessions / this.analytics.totalSessions) * 100
      : 0

    // Calculate average time to complete
    const completedSessions = sessions.filter(s => s.completed && s.completedAt)
    if (completedSessions.length > 0) {
      const totalTime = completedSessions.reduce((sum, s) => {
        return sum + (s.completedAt - s.startedAt)
      }, 0)
      this.analytics.avgTimeToComplete = totalTime / completedSessions.length / 1000 // Convert to seconds
    }

    // Calculate per-step data
    this.analytics.stepData = []
    
    for (let i = 0; i < this.steps.length; i++) {
      const stepSessions = sessions.filter(s => 
        s.completedSteps.some(cs => cs.stepIndex === i)
      )

      const entered = stepSessions.length
      const completed = stepSessions.filter(s => 
        i === this.steps.length - 1 || s.completedSteps.some(cs => cs.stepIndex === i + 1)
      ).length
      const dropOff = entered - completed

      // Average time on step
      const stepTimes = stepSessions.map(s => {
        const step = s.completedSteps.find(cs => cs.stepIndex === i)
        return step ? step.timeSpent : 0
      }).filter(t => t > 0)

      const avgTimeOnStep = stepTimes.length > 0
        ? stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length / 1000
        : 0

      this.analytics.stepData.push({
        stepIndex: i,
        entered,
        completed,
        dropOff,
        dropOffRate: entered > 0 ? (dropOff / entered) * 100 : 0,
        avgTimeOnStep
      })
    }

    this.lastCalculated = Date.now()
    await this.save()

    return this.analytics
  } catch (error) {
    console.error('Calculate analytics error:', error)
    throw error
  }
}

module.exports = mongoose.model('Funnel', funnelSchema)