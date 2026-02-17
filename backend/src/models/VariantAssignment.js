const mongoose = require('mongoose')

const variantAssignmentSchema = new mongoose.Schema({
  experiment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experiment',
    required: true
  },
  
  // User identification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  anonymousId: String, // For non-authenticated users
  
  // Assignment
  variant: {
    type: String,
    required: true
  },
  
  // Tracking
  events: [{
    type: {
      type: String,
      enum: ['impression', 'click', 'conversion', 'bounce']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Session info
  sessionId: String,
  device: String,
  browser: String,
  country: String,
  
  // Conversion
  converted: {
    type: Boolean,
    default: false
  },
  convertedAt: Date,
  conversionValue: Number
}, {
  timestamps: true
})

// Index
variantAssignmentSchema.index({ experiment: 1, user: 1 })
variantAssignmentSchema.index({ experiment: 1, anonymousId: 1 })
variantAssignmentSchema.index({ experiment: 1, variant: 1 })

// Methods
variantAssignmentSchema.methods.trackEvent = function(type, metadata = null) {
  this.events.push({ type, metadata })
  return this.save()
}

variantAssignmentSchema.methods.markConverted = function(value = 0) {
  if (!this.converted) {
    this.converted = true
    this.convertedAt = Date.now()
    this.conversionValue = value
    return this.save()
  }
}

module.exports = mongoose.model('VariantAssignment', variantAssignmentSchema)