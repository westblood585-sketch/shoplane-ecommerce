const Heatmap = require('../models/Heatmap')
const SessionRecording = require('../models/SessionRecording')

class AnalyticsService {
  // Track heatmap data
  async trackHeatmapData(page, url, type, x, y, value, element, viewport, sessionInfo) {
    try {
      // Find or create heatmap
      let heatmap = await Heatmap.findOne({
        page,
        type,
        isActive: true
      })

      if (!heatmap) {
        heatmap = await Heatmap.create({
          page,
          url,
          type
        })
      }

      // Add data point
      await heatmap.addDataPoint(x, y, value, element, viewport)

      // Add session if not already added
      const sessionExists = heatmap.sessions.some(
        s => s.sessionId === sessionInfo.sessionId
      )

      if (!sessionExists) {
        heatmap.sessions.push(sessionInfo)
        await heatmap.save()
      }

      return heatmap
    } catch (error) {
      console.error('Track heatmap error:', error)
    }
  }

  // Get heatmap data
  async getHeatmapData(page, type, startDate = null, endDate = null) {
    try {
      const query = { page, type, isActive: true }

      if (startDate && endDate) {
        query['dataPoints.timestamp'] = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }

      const heatmap = await Heatmap.findOne(query)

      if (!heatmap) return null

      // Calculate hotspots if not already calculated
      if (heatmap.aggregated.hotspots.length === 0) {
        await heatmap.calculateHotspots()
      }

      return {
        page: heatmap.page,
        type: heatmap.type,
        dataPoints: heatmap.dataPoints,
        hotspots: heatmap.aggregated.hotspots,
        stats: {
          totalClicks: heatmap.aggregated.totalClicks,
          totalSessions: heatmap.sessions.length,
          avgScrollDepth: heatmap.aggregated.avgScrollDepth
        }
      }
    } catch (error) {
      console.error('Get heatmap error:', error)
      return null
    }
  }

  // Create session recording
  async createSession(sessionId, userId, anonymousId, deviceInfo) {
    try {
      // Check if session already exists
      let recording = await SessionRecording.findOne({ sessionId })
      
      if (recording) {
        return recording
      }

      recording = await SessionRecording.create({
        sessionId,
        user: userId,
        anonymousId,
        device: deviceInfo
      })

      return recording
    } catch (error) {
      console.error('Create session error:', error)
      throw error
    }
  }

  // Add event to session
  async addSessionEvent(sessionId, event) {
    try {
      const recording = await SessionRecording.findOne({ sessionId })
      if (!recording) return

      await recording.addEvent(event)

      return recording
    } catch (error) {
      console.error('Add session event error:', error)
    }
  }

  // End session
  async endSession(sessionId, converted = false, conversionValue = 0) {
    try {
      const recording = await SessionRecording.findOne({ sessionId })
      if (!recording) return

      recording.converted = converted
      recording.conversionValue = conversionValue
      await recording.endSession()

      return recording
    } catch (error) {
      console.error('End session error:', error)
    }
  }

  // Get session replay data
  async getSessionReplay(sessionId) {
    try {
      const recording = await SessionRecording.findOne({ sessionId })
        .populate('user', 'name email')

      if (!recording) return null

      return {
        sessionId: recording.sessionId,
        user: recording.user,
        duration: recording.duration,
        pages: recording.pages,
        events: recording.events,
        snapshots: recording.snapshots,
        converted: recording.converted,
        hasRageClicks: recording.hasRageClicks,
        hasErrors: recording.hasErrors,
        errors: recording.errors
      }
    } catch (error) {
      console.error('Get session replay error:', error)
      return null
    }
  }

  // Get sessions list with filters
  async getSessions(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        converted,
        hasRageClicks,
        hasErrors,
        minDuration,
        maxDuration,
        startDate,
        endDate
      } = filters

      const query = {}

      if (converted !== undefined) query.converted = converted
      if (hasRageClicks !== undefined) query.hasRageClicks = hasRageClicks
      if (hasErrors !== undefined) query.hasErrors = hasErrors
      if (minDuration) query.duration = { $gte: minDuration }
      if (maxDuration) {
        query.duration = { ...query.duration, $lte: maxDuration }
      }
      if (startDate && endDate) {
        query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) }
      }

      const sessions = await SessionRecording.find(query)
        .populate('user', 'name email')
        .sort({ startTime: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await SessionRecording.countDocuments(query)

      return {
        sessions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    } catch (error) {
      console.error('Get sessions error:', error)
      return { sessions: [], total: 0 }
    }
  }

  // Generate insights
  async generateInsights(page) {
    try {
      const clickHeatmap = await this.getHeatmapData(page, 'click')
      const sessions = await SessionRecording.find({
        'pages.url': { $regex: page }
      }).limit(100)

      const insights = {
        // Most clicked elements
        topClicks: clickHeatmap?.hotspots?.slice(0, 5) || [],

        // Rage click areas
        rageClickAreas: sessions
          .filter(s => s.hasRageClicks)
          .map(s => s.events.filter(e => e.type === 'click'))
          .flat()
          .slice(0, 5),

        // Error prone sessions
        errorRate: sessions.length > 0
          ? (sessions.filter(s => s.hasErrors).length / sessions.length) * 100
          : 0,

        // Avg session duration
        avgDuration: sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
          : 0,

        // Conversion rate
        conversionRate: sessions.length > 0
          ? (sessions.filter(s => s.converted).length / sessions.length) * 100
          : 0,

        // Drop-off points
        dropOffPoints: this.calculateDropOffPoints(sessions)
      }

      return insights
    } catch (error) {
      console.error('Generate insights error:', error)
      return null
    }
  }

  // Helper: Calculate drop-off points
  calculateDropOffPoints(sessions) {
    const urlCounts = new Map()

    sessions.forEach(session => {
      session.pages.forEach((page, index) => {
        const key = page.url
        if (!urlCounts.has(key)) {
          urlCounts.set(key, { entered: 0, left: 0 })
        }

        urlCounts.get(key).entered += 1

        if (index < session.pages.length - 1) {
          // Not the last page, user left
          urlCounts.get(key).left += 1
        }
      })
    })

    return Array.from(urlCounts.entries())
      .map(([url, counts]) => ({
        url,
        dropOffRate: counts.entered > 0
          ? (counts.left / counts.entered) * 100
          : 0,
        visitors: counts.entered
      }))
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 5)
  }
}

module.exports = new AnalyticsService()