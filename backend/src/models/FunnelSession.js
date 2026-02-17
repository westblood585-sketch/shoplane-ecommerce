const mongoose = require('mongoose')

const funnelSessionSchema = new mongoose.Schema({
  funnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funnel',
    required: true
  },
  
  // User/Session identification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  anonymousId: String,
  sessionId: String,
  
  // Journey
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  completed: {
    type: Boolean,
    default: false
  },
  
  // Steps completed
  completedSteps: [{
    stepIndex: Number,
    stepName: String,
    completedAt: Date,
    timeSpent: Number, // Milliseconds
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Current step
  currentStep: {
    type: Number,
    default: 0
  },
  
  // Device & source
  device: String,
  browser: String,
  source: String,
  utmParams: mongoose.Schema.Types.Mixed,
  
  // Conversion data
  conversionValue: Number,
  conversionCurrency: String,
  
  // Segment
  segment: String
}, {
  timestamps: true
})

// Index
funnelSessionSchema.index({ funnel: 1, user: 1 })
funnelSessionSchema.index({ funnel: 1, anonymousId: 1 })
funnelSessionSchema.index({ funnel: 1, completed: 1 })
funnelSessionSchema.index({ startedAt: -1 })

// Methods
funnelSessionSchema.methods.completeStep = function(stepIndex, metadata = null) {
  // Check if step already completed
  const existing = this.completedSteps.find(s => s.stepIndex === stepIndex)
  if (existing) return

  // Calculate time spent
  const previousStep = this.completedSteps[this.completedSteps.length - 1]
  const timeSpent = previousStep
    ? Date.now() - previousStep.completedAt
    : Date.now() - this.startedAt

  this.completedSteps.push({
    stepIndex,
    completedAt: Date.now(),
    timeSpent,
    metadata
  })

  this.currentStep = stepIndex + 1

  return this.save()
}

funnelSessionSchema.methods.completeFunnel = function(value = 0, currency = 'TRY') {
  this.completed = true
  this.completedAt = Date.now()
  this.conversionValue = value
  this.conversionCurrency = currency

  return this.save()
}

module.exports = mongoose.model('FunnelSession', funnelSessionSchema)