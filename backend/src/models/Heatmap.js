const mongoose = require('mongoose')

const heatmapSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  
  // Heatmap type
  type: {
    type: String,
    enum: ['click', 'move', 'scroll', 'attention'],
    required: true
  },
  
  // Data points
  dataPoints: [{
    x: Number, // Pixel position
    y: Number,
    value: Number, // Intensity/duration
    timestamp: {
      type: Date,
      default: Date.now
    },
    
    // Additional context
    element: String, // CSS selector
    elementText: String,
    viewport: {
      width: Number,
      height: Number
    }
  }],
  
  // Session info
  sessions: [{
    sessionId: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    anonymousId: String,
    device: String,
    browser: String,
    timestamp: Date
  }],
  
  // Aggregated data
  aggregated: {
    totalClicks: {
      type: Number,
      default: 0
    },
    totalScrolls: {
      type: Number,
      default: 0
    },
    avgScrollDepth: {
      type: Number,
      default: 0
    },
    maxScrollDepth: {
      type: Number,
      default: 0
    },
    hotspots: [{
      x: Number,
      y: Number,
      intensity: Number,
      element: String
    }]
  },
  
  // Time range
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index
heatmapSchema.index({ page: 1, type: 1 })
heatmapSchema.index({ url: 1 })
heatmapSchema.index({ isActive: 1 })

// Methods
heatmapSchema.methods.addDataPoint = function(x, y, value, element, viewport) {
  this.dataPoints.push({
    x,
    y,
    value,
    element,
    viewport
  })
  
  // Update aggregated data
  if (this.type === 'click') {
    this.aggregated.totalClicks += 1
  }
  
  return this.save()
}

heatmapSchema.methods.calculateHotspots = function(gridSize = 50) {
  // Grid-based hotspot calculation
  const grid = new Map()
  
  this.dataPoints.forEach(point => {
    const gridX = Math.floor(point.x / gridSize) * gridSize
    const gridY = Math.floor(point.y / gridSize) * gridSize
    const key = `${gridX},${gridY}`
    
    if (!grid.has(key)) {
      grid.set(key, { x: gridX, y: gridY, intensity: 0, count: 0 })
    }
    
    const cell = grid.get(key)
    cell.intensity += point.value || 1
    cell.count += 1
  })
  
  // Convert to array and sort by intensity
  const hotspots = Array.from(grid.values())
    .map(cell => ({
      x: cell.x,
      y: cell.y,
      intensity: cell.intensity / cell.count
    }))
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 20) // Top 20 hotspots
  
  this.aggregated.hotspots = hotspots
  return this.save()
}

module.exports = mongoose.model('Heatmap', heatmapSchema)
