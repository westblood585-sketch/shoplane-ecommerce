const journeyService = require('../services/journeyService')
const CustomerJourney = require('../models/CustomerJourney')

// @desc    Track touchpoint
// @route   POST /api/journeys/track
// @access  Public
exports.trackTouchpoint = async (req, res, next) => {
  try {
    const { type, channel, page, product, metadata } = req.body
    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    const touchpointData = {
      type,
      channel: channel || 'web',
      device: req.headers['user-agent'],
      page,
      product,
      metadata,
      source: req.headers.referer
    }

    await journeyService.trackTouchpoint(userId, anonymousId, touchpointData)

    res.status(200).json({
      success: true,
      message: 'Touchpoint tracked'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get my journey
// @route   GET /api/journeys/my-journey
// @access  Private
exports.getMyJourney = async (req, res, next) => {
  try {
    const userId = req.user.id

    const journey = await CustomerJourney.findOne({
      user: userId,
      status: 'active'
    })
    .populate('touchpoints.product', 'name images price')
    .populate('viewedProducts.product', 'name images price')

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey bulunamadı'
      })
    }

    const visualization = await journeyService.getJourneyVisualization(journey.journeyId)

    res.status(200).json({
      success: true,
      journey: visualization
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get journey visualization
// @route   GET /api/journeys/:journeyId
// @access  Private/Admin
exports.getJourneyVisualization = async (req, res, next) => {
  try {
    const { journeyId } = req.params

    const visualization = await journeyService.getJourneyVisualization(journeyId)

    if (!visualization) {
      return res.status(404).json({
        success: false,
        message: 'Journey bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      journey: visualization
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all journeys
// @route   GET /api/journeys
// @access  Private/Admin
exports.getAllJourneys = async (req, res, next) => {
  try {
    const {
      status,
      stage,
      page = 1,
      limit = 20
    } = req.query

    const query = {}
    if (status) query.status = status
    if (stage) query.currentStage = stage

    const journeys = await CustomerJourney.find(query)
      .populate('user', 'name email')
      .sort({ lastActivityAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await CustomerJourney.countDocuments(query)

    res.status(200).json({
      success: true,
      journeys,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Analyze journey patterns
// @route   POST /api/journeys/analyze
// @access  Private/Admin
exports.analyzePatterns = async (req, res, next) => {
  try {
    const filters = req.body

    const patterns = await journeyService.analyzeJourneyPatterns(filters)

    res.status(200).json({
      success: true,
      patterns
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get high-intent users
// @route   GET /api/journeys/high-intent
// @access  Private/Admin
exports.getHighIntentUsers = async (req, res, next) => {
  try {
    const { minIntent = 70 } = req.query

    const users = await journeyService.getHighIntentUsers(parseInt(minIntent))

    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get journey statistics
// @route   GET /api/journeys/stats
// @access  Private/Admin
exports.getJourneyStats = async (req, res, next) => {
  try {
    const stats = await CustomerJourney.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgEngagement: { $avg: '$metrics.engagementScore' },
          avgPurchaseIntent: { $avg: '$metrics.purchaseIntent' },
          avgTouchpoints: { $avg: '$metrics.totalTouchpoints' }
        }
      }
    ])

    // Stage distribution
    const stageDistribution = await CustomerJourney.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$currentStage',
          count: { $sum: 1 }
        }
      }
    ])

    // Conversion stats
    const converted = await CustomerJourney.countDocuments({ converted: true })
    const total = await CustomerJourney.countDocuments()
    const conversionRate = total > 0 ? (converted / total) * 100 : 0

    res.status(200).json({
      success: true,
      stats: {
        byStatus: stats,
        stageDistribution,
        overallConversionRate: conversionRate,
        totalJourneys: total,
        convertedJourneys: converted
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports