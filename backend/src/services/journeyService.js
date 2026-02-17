const CustomerJourney = require('../models/CustomerJourney')
const { v4: uuidv4 } = require('uuid')

class JourneyService {
  // Get or create journey
  async getOrCreateJourney(userId, anonymousId, firstTouchData) {
    try {
      // Try to find existing journey
      let journey = await CustomerJourney.findOne({
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(anonymousId ? [{ anonymousId }] : [])
        ],
        status: 'active'
      })

      if (journey) {
        return journey
      }

      // Create new journey
      journey = await CustomerJourney.create({
        journeyId: uuidv4(),
        user: userId,
        anonymousId,
        firstTouch: firstTouchData,
        utmParams: firstTouchData?.utmParams
      })

      return journey
    } catch (error) {
      console.error('Get or create journey error:', error)
      throw error
    }
  }

  // Track touchpoint
  async trackTouchpoint(userId, anonymousId, touchpointData) {
    try {
      let journey = await this.getOrCreateJourney(userId, anonymousId, {
        channel: touchpointData.channel,
        source: touchpointData.source,
        timestamp: Date.now()
      })

      // Create the touchpoint object
      const newTouchpoint = {
        type: touchpointData.type,
        timestamp: new Date(),
        channel: touchpointData.channel || 'web',
        device: touchpointData.device,
        page: touchpointData.page,
        product: touchpointData.product,
        order: touchpointData.order,
        metadata: touchpointData.metadata
      }

      // Use findByIdAndUpdate for the primary update
      const updatedJourney = await CustomerJourney.findByIdAndUpdate(
        journey._id,
        {
          $push: {
            touchpoints: newTouchpoint
          },
          $set: {
            lastActivityAt: new Date(),
            lastTouch: {
              channel: touchpointData.channel || 'web',
              source: touchpointData.source,
              timestamp: new Date()
            }
          },
          $inc: {
            'metrics.totalTouchpoints': 1
          }
        },
        { new: true, strict: false }
      )

      // Now do the secondary updates in a separate operation to avoid version conflicts
      if (updatedJourney) {
        // Use bulkWrite for additional updates to avoid version conflicts
        const channel = touchpointData.channel || 'web'
        const touchpointCount = updatedJourney.metrics.totalTouchpoints
        
        // Find if channel exists in channelMix
        const channelExists = updatedJourney.metrics.channelMix && 
                             updatedJourney.metrics.channelMix.some(c => c.channel === channel)

        if (channelExists) {
          // Increment existing channel
          await CustomerJourney.updateOne(
            { _id: updatedJourney._id, 'metrics.channelMix.channel': channel },
            { 
              $inc: { 'metrics.channelMix.$.count': 1 }
            }
          )
        } else {
          // Add new channel
          await CustomerJourney.updateOne(
            { _id: updatedJourney._id },
            {
              $push: {
                'metrics.channelMix': {
                  channel,
                  count: 1,
                  percentage: (1 / touchpointCount) * 100
                }
              }
            }
          )
        }
      }

      // Return the updated journey (fetch fresh to get the latest state)
      return await CustomerJourney.findById(journey._id)
    } catch (error) {
      console.error('Track touchpoint error:', error)
      throw error
    }
  }

  // Get journey visualization data
  async getJourneyVisualization(journeyId) {
    try {
      const journey = await CustomerJourney.findOne({ journeyId })
        .populate('touchpoints.product', 'name images price')
        .populate('touchpoints.order', 'orderNumber totalAmount')
        .populate('viewedProducts.product', 'name images price')

      if (!journey) return null

      // Group touchpoints by stage
      const stageTimeline = journey.stages.map(stage => ({
        name: stage.name,
        enteredAt: stage.enteredAt,
        exitedAt: stage.exitedAt,
        duration: stage.duration,
        touchpoints: journey.touchpoints.filter(t => {
          return t.timestamp >= stage.enteredAt && 
                 (!stage.exitedAt || t.timestamp <= stage.exitedAt)
        })
      }))

      return {
        journeyId: journey.journeyId,
        status: journey.status,
        currentStage: journey.currentStage,
        startedAt: journey.startedAt,
        duration: journey.duration,
        metrics: journey.metrics,
        stageTimeline,
        touchpoints: journey.touchpoints,
        firstTouch: journey.firstTouch,
        lastTouch: journey.lastTouch,
        converted: journey.converted,
        conversionValue: journey.conversionValue
      }
    } catch (error) {
      console.error('Get visualization error:', error)
      throw error
    }
  }

  // Analyze journey patterns
  async analyzeJourneyPatterns(filters = {}) {
    try {
      const {
        stage,
        status,
        minEngagement,
        minPurchaseIntent,
        startDate,
        endDate
      } = filters

      const query = {}

      if (stage) query.currentStage = stage
      if (status) query.status = status
      if (minEngagement) query['metrics.engagementScore'] = { $gte: minEngagement }
      if (minPurchaseIntent) query['metrics.purchaseIntent'] = { $gte: minPurchaseIntent }
      if (startDate && endDate) {
        query.startedAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
      }

      const journeys = await CustomerJourney.find(query)

      // Common patterns
      const patterns = {
        // Most common paths
        commonPaths: this.findCommonPaths(journeys),
        
        // Average touchpoints per stage
        avgTouchpointsPerStage: this.calculateAvgTouchpointsPerStage(journeys),
        
        // Channel performance
        channelPerformance: this.analyzeChannelPerformance(journeys),
        
        // Time to conversion
        timeToConversion: this.calculateTimeToConversion(journeys),
        
        // Drop-off points
        dropOffPoints: this.identifyDropOffPoints(journeys)
      }

      return patterns
    } catch (error) {
      console.error('Analyze patterns error:', error)
      throw error
    }
  }

  // Helper: Find common paths
  findCommonPaths(journeys) {
    const paths = new Map()

    journeys.forEach(journey => {
      const path = journey.stages
        .sort((a, b) => a.enteredAt - b.enteredAt)
        .map(s => s.name)
        .join(' → ')

      paths.set(path, (paths.get(path) || 0) + 1)
    })

    return Array.from(paths.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Helper: Calculate avg touchpoints per stage
  calculateAvgTouchpointsPerStage(journeys) {
    const stageData = {}

    journeys.forEach(journey => {
      journey.stages.forEach(stage => {
        if (!stageData[stage.name]) {
          stageData[stage.name] = { total: 0, count: 0 }
        }
        stageData[stage.name].total += stage.touchpointCount
        stageData[stage.name].count += 1
      })
    })

    return Object.entries(stageData).map(([stage, data]) => ({
      stage,
      avgTouchpoints: data.total / data.count
    }))
  }

  // Helper: Analyze channel performance
  analyzeChannelPerformance(journeys) {
    const channelData = {}

    journeys.forEach(journey => {
      journey.touchpoints.forEach(touchpoint => {
        if (!channelData[touchpoint.channel]) {
          channelData[touchpoint.channel] = {
            totalTouchpoints: 0,
            conversions: 0,
            revenue: 0
          }
        }

        channelData[touchpoint.channel].totalTouchpoints += 1

        if (journey.converted) {
          channelData[touchpoint.channel].conversions += 1
          channelData[touchpoint.channel].revenue += journey.conversionValue || 0
        }
      })
    })

    return Object.entries(channelData).map(([channel, data]) => ({
      channel,
      ...data,
      conversionRate: (data.conversions / data.totalTouchpoints) * 100,
      avgRevenue: data.conversions > 0 ? data.revenue / data.conversions : 0
    }))
  }

  // Helper: Calculate time to conversion
  calculateTimeToConversion(journeys) {
    const converted = journeys.filter(j => j.converted)

    if (converted.length === 0) return null

    const times = converted.map(j => j.duration)
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)]

    return {
      average: avg,
      median,
      min: Math.min(...times),
      max: Math.max(...times)
    }
  }

  // Helper: Identify drop-off points
  identifyDropOffPoints(journeys) {
    const stageTransitions = {}

    journeys.forEach(journey => {
      for (let i = 0; i < journey.stages.length - 1; i++) {
        const from = journey.stages[i].name
        const to = journey.stages[i + 1].name
        const key = `${from} → ${to}`

        if (!stageTransitions[key]) {
          stageTransitions[key] = { total: 0, dropped: 0 }
        }

        stageTransitions[key].total += 1
      }

      // Last stage drop-offs
      const lastStage = journey.stages[journey.stages.length - 1]
      if (!journey.converted && lastStage) {
        const key = `${lastStage.name} → DROP-OFF`
        if (!stageTransitions[key]) {
          stageTransitions[key] = { total: 0, dropped: 0 }
        }
        stageTransitions[key].dropped += 1
        stageTransitions[key].total += 1
      }
    })

    return Object.entries(stageTransitions)
      .map(([transition, data]) => ({
        transition,
        dropOffRate: (data.dropped / data.total) * 100,
        count: data.dropped
      }))
      .filter(t => t.dropOffRate > 0)
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
  }

  // Get high-intent users
  async getHighIntentUsers(minIntent = 70) {
    try {
      const journeys = await CustomerJourney.find({
        'metrics.purchaseIntent': { $gte: minIntent },
        status: 'active',
        converted: false
      })
      .populate('user', 'name email')
      .sort({ 'metrics.purchaseIntent': -1 })
      .limit(50)

      return journeys.map(j => ({
        journeyId: j.journeyId,
        user: j.user,
        currentStage: j.currentStage,
        purchaseIntent: j.metrics.purchaseIntent,
        engagementScore: j.metrics.engagementScore,
        lastActivity: j.lastActivityAt,
        viewedProducts: j.viewedProducts
      }))
    } catch (error) {
      console.error('Get high-intent users error:', error)
      throw error
    }
  }
}

module.exports = new JourneyService()
