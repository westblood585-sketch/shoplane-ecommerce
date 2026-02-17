const mongoose = require('mongoose')

const sessionRecordingSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // User info
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  anonymousId: String,
  
  // Session metadata
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // Seconds
  
  // Device & Browser
  device: {
    userAgent: String,
    screenWidth: Number,
    screenHeight: Number,
    deviceType: String, // mobile, tablet, desktop
    browser: String,
    os: String,
    cpu: String,
    ram: String
  },
  
  // Pages visited
  pages: [{
    url: String,
    title: String,
    enteredAt: Date,
    leftAt: Date,
    duration: Number,
    scrollDepth: Number
  }],
  
  // Events
  events: [{
    type: {
      type: String,
      enum: ['click', 'scroll', 'input', 'mousemove', 'keypress', 'resize', 'navigation', 'error', 'focus', 'blur']
    },
    timestamp: Number, // Relative to session start (ms)
    target: {
      element: String, // CSS selector
      text: String,
      attributes: mongoose.Schema.Types.Mixed
    },
    position: {
      x: Number,
      y: Number,
      scrollX: Number,
      scrollY: Number
    },
    value: mongoose.Schema.Types.Mixed, // For input events
    url: String
  }],
  
  // Snapshots (DOM states at key moments)
  snapshots: [{
    timestamp: Number,
    url: String,
    html: String, // Sanitized HTML
    css: String,
    viewport: {
      width: Number,
      height: Number
    }
  }],
  
  // Conversion info
  converted: {
    type: Boolean,
    default: false
  },
  conversionValue: Number,
  conversionType: String,
  
  // Flags
  hasRageClicks: {
    type: Boolean,
    default: false
  },
  hasErrors: {
    type: Boolean,
    default: false
  },
  errors: [{
    message: String,
    stack: String,
    timestamp: Number
  }],
  
  // Tags
  tags: [String],
  
  // Privacy
  masked: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  __versionKey: false,
  suppressReservedKeysWarning: true
})

// Index - sessionId already has unique index from field definition
sessionRecordingSchema.index({ user: 1 })
sessionRecordingSchema.index({ anonymousId: 1 })
sessionRecordingSchema.index({ startTime: -1 })
sessionRecordingSchema.index({ converted: 1 })

// Virtual: Is long session
sessionRecordingSchema.virtual('isLongSession').get(function() {
  return this.duration > 300 // 5 minutes
})

// Methods
sessionRecordingSchema.methods.addEvent = function(event) {
  this.events.push(event)
  
  // Detect rage clicks
  if (event.type === 'click') {
    const recentClicks = this.events
      .filter(e => e.type === 'click')
      .slice(-5)
    
    if (recentClicks.length >= 5) {
      const timeSpan = recentClicks[4].timestamp - recentClicks[0].timestamp
      if (timeSpan < 2000) { // 5 clicks in 2 seconds
        this.hasRageClicks = true
      }
    }
  }
  
  return this.save()
}

sessionRecordingSchema.methods.addSnapshot = function(url, html, css, viewport) {
  const timestamp = Date.now() - this.startTime
  
  this.snapshots.push({
    timestamp,
    url,
    html,
    css,
    viewport
  })
  
  return this.save()
}

sessionRecordingSchema.methods.endSession = function() {
  this.endTime = Date.now()
  this.duration = Math.floor((this.endTime - this.startTime) / 1000)
  return this.save()
}

module.exports = mongoose.model('SessionRecording', sessionRecordingSchema)