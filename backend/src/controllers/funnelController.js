const Funnel = require('../models/Funnel')
const funnelService = require('../services/funnelService')

// @desc    Create funnel
// @route   POST /api/funnels
// @access  Private/Admin
exports.createFunnel = async (req, res, next) => {
  try {
    const funnel = await Funnel.create(req.body)

    res.status(201).json({
      success: true,
      funnel
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all funnels
// @route   GET /api/funnels
// @access  Private/Admin
exports.getFunnels = async (req, res, next) => {
  try {
    const funnels = await Funnel.find()
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      funnels
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get funnel analytics
// @route   GET /api/funnels/:id/analytics
// @access  Private/Admin
exports.getFunnelAnalytics = async (req, res, next) => {
  try {
    const analytics = await funnelService.getFunnelAnalytics(req.params.id)

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Funnel bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      ...analytics
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Start funnel tracking
// @route   POST /api/funnels/:id/start
// @access  Public
exports.startFunnelTracking = async (req, res, next) => {
  try {
    const { deviceInfo } = req.body
    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']
    const sessionId = req.headers['x-session-id']

    const funnelSession = await funnelService.startFunnelSession(
      req.params.id,
      userId,
      anonymousId,
      sessionId,
      deviceInfo
    )

    res.status(200).json({
      success: true,
      funnelSessionId: funnelSession._id
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Track step completion
// @route   POST /api/funnels/:id/step/:stepIndex
// @access  Public
exports.trackStepCompletion = async (req, res, next) => {
  try {
    const { stepIndex } = req.params
    const { metadata } = req.body
    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    await funnelService.trackStepCompletion(
      req.params.id,
      userId,
      anonymousId,
      parseInt(stepIndex),
      metadata
    )

    res.status(200).json({
      success: true,
      message: 'Step tracked'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get funnel sessions
// @route   GET /api/funnels/:id/sessions
// @access  Private/Admin
exports.getFunnelSessions = async (req, res, next) => {
  try {
    const result = await funnelService.getFunnelSessions(
      req.params.id,
      req.query
    )

    res.status(200).json({
      success: true,
      ...result
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get drop-off analysis
// @route   GET /api/funnels/:id/dropoff
// @access  Private/Admin
exports.getDropOffAnalysis = async (req, res, next) => {
  try {
    const dropOffPoints = await funnelService.analyzeDropOffPoints(req.params.id)

    res.status(200).json({
      success: true,
      dropOffPoints
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get conversion paths
// @route   GET /api/funnels/:id/paths
// @access  Private/Admin
exports.getConversionPaths = async (req, res, next) => {
  try {
    const { limit } = req.query
    const paths = await funnelService.getConversionPaths(
      req.params.id,
      parseInt(limit) || 10
    )

    res.status(200).json({
      success: true,
      paths
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Compare segments
// @route   POST /api/funnels/:id/compare
// @access  Private/Admin
exports.compareSegments = async (req, res, next) => {
  try {
    const { segmentA, segmentB } = req.body

    const comparison = await funnelService.compareSegments(
      req.params.id,
      segmentA,
      segmentB
    )

    res.status(200).json({
      success: true,
      comparison
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update funnel
// @route   PUT /api/funnels/:id
// @access  Private/Admin
exports.updateFunnel = async (req, res, next) => {
  try {
    const funnel = await Funnel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!funnel) {
      return res.status(404).json({
        success: false,
        message: 'Funnel bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      funnel
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete funnel
// @route   DELETE /api/funnels/:id
// @access  Private/Admin
exports.deleteFunnel = async (req, res, next) => {
  try {
    const funnel = await Funnel.findByIdAndDelete(req.params.id)

    if (!funnel) {
      return res.status(404).json({
        success: false,
        message: 'Funnel bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Funnel silindi'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports