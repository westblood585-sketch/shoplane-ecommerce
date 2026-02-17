const Funnel = require('../models/Funnel')
const FunnelSession = require('../models/FunnelSession')

class FunnelService {
  // Start tracking funnel session
  async startFunnelSession(funnelId, userId, anonymousId, sessionId, deviceInfo) {
    try {
      // Check if session already exists
      let funnelSession = await FunnelSession.findOne({
        funnel: funnelId,
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(anonymousId ? [{ anonymousId }] : [])
        ],
        completed: false
      })

      if (funnelSession) {
        return funnelSession
      }

      // Create new session
      funnelSession = await FunnelSession.create({
        funnel: funnelId,
        user: userId,
        anonymousId,
        sessionId,
        device: deviceInfo?.device,
        browser: deviceInfo?.browser,
        source: deviceInfo?.source,
        utmParams: deviceInfo?.utmParams
      })

      return funnelSession
    } catch (error) {
      console.error('Start funnel session error:', error)
      throw error
    }
  }

  // Track step completion
  async trackStepCompletion(funnelId, userId, anonymousId, stepIndex, metadata = null) {
    try {
      const funnelSession = await FunnelSession.findOne({
        funnel: funnelId,
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(anonymousId ? [{ anonymousId }] : [])
        ],
        completed: false
      })

      if (!funnelSession) {
        console.log('Funnel session not found')
        return null
      }

      await funnelSession.completeStep(stepIndex, metadata)

      // Check if funnel is complete
      const funnel = await Funnel.findById(funnelId)
      if (stepIndex === funnel.steps.length - 1) {
        await funnelSession.completeFunnel()
      }

      return funnelSession
    } catch (error) {
      console.error('Track step error:', error)
      throw error
    }
  }

  // Get funnel analytics
  async getFunnelAnalytics(funnelId) {
    try {
      const funnel = await Funnel.findById(funnelId)
      if (!funnel) return null

      // Calculate if not calculated recently (within 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (!funnel.lastCalculated || funnel.lastCalculated < oneHourAgo) {
        await funnel.calculateAnalytics()
      }

      return {
        funnel: {
          name: funnel.name,
          description: funnel.description,
          steps: funnel.steps
        },
        analytics: funnel.analytics,
        lastCalculated: funnel.lastCalculated
      }
    } catch (error) {
      console.error('Get analytics error:', error)
      throw error
    }
  }

  // Get sessions for funnel
  async getFunnelSessions(funnelId, filters = {}) {
    try {
      const {
        completed,
        segment,
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = filters

      const query = { funnel: funnelId }

      if (completed !== undefined) query.completed = completed
      if (segment) query.segment = segment
      if (startDate && endDate) {
        query.startedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }

      const sessions = await FunnelSession.find(query)
        .populate('user', 'name email')
        .sort({ startedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await FunnelSession.countDocuments(query)

      return {
        sessions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    } catch (error) {
      console.error('Get sessions error:', error)
      throw error
    }
  }

  // Analyze drop-off points
  async analyzeDropOffPoints(funnelId) {
    try {
      const funnel = await Funnel.findById(funnelId)
      if (!funnel) return null

      const dropOffPoints = []

      for (let i = 0; i < funnel.steps.length - 1; i++) {
        const stepData = funnel.analytics.stepData[i]
        
        if (stepData && stepData.dropOffRate > 0) {
          // Get sample sessions that dropped off at this step
          const droppedSessions = await FunnelSession.find({
            funnel: funnelId,
            currentStep: i + 1,
            completed: false
          })
          .limit(10)
          .populate('user', 'name email')

          dropOffPoints.push({
            stepIndex: i,
            stepName: funnel.steps[i].name,
            nextStepName: funnel.steps[i + 1].name,
            dropOffCount: stepData.dropOff,
            dropOffRate: stepData.dropOffRate,
            sampleSessions: droppedSessions
          })
        }
      }

      // Sort by drop-off rate
      dropOffPoints.sort((a, b) => b.dropOffRate - a.dropOffRate)

      return dropOffPoints
    } catch (error) {
      console.error('Analyze drop-off error:', error)
      throw error
    }
  }

  // Get conversion paths
  async getConversionPaths(funnelId, limit = 10) {
    try {
      const completedSessions = await FunnelSession.find({
        funnel: funnelId,
        completed: true
      })
      .sort({ completedAt: -1 })
      .limit(limit)

      const paths = completedSessions.map(session => ({
        sessionId: session.sessionId,
        user: session.user,
        steps: session.completedSteps.map(s => ({
          stepName: s.stepName,
          timeSpent: (s.timeSpent / 1000).toFixed(2) + 's'
        })),
        totalTime: session.completedAt ? 
          ((session.completedAt - session.startedAt) / 1000).toFixed(2) + 's' : null,
        conversionValue: session.conversionValue
      }))

      return paths
    } catch (error) {
      console.error('Get conversion paths error:', error)
      throw error
    }
  }

  // Compare segments
  async compareSegments(funnelId, segmentA, segmentB) {
    try {
      const getSegmentStats = async (segment) => {
        const sessions = await FunnelSession.find({
          funnel: funnelId,
          segment
        })

        const completed = sessions.filter(s => s.completed).length
        const total = sessions.length
        const conversionRate = total > 0 ? (completed / total) * 100 : 0

        const avgValue = completed > 0
          ? sessions.reduce((sum, s) => sum + (s.conversionValue || 0), 0) / completed
          : 0

        return {
          segment,
          totalSessions: total,
          completedSessions: completed,
          conversionRate,
          avgConversionValue: avgValue
        }
      }

      const statsA = await getSegmentStats(segmentA)
      const statsB = await getSegmentStats(segmentB)

      return {
        segmentA: statsA,
        segmentB: statsB,
        comparison: {
          conversionRateDiff: statsA.conversionRate - statsB.conversionRate,
          avgValueDiff: statsA.avgConversionValue - statsB.avgConversionValue
        }
      }
    } catch (error) {
      console.error('Compare segments error:', error)
      throw error
    }
  }
}

module.exports = new FunnelService()