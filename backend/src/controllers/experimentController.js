const Experiment = require('../models/Experiment')
const experimentService = require('../services/experimentService')

// @desc    Create experiment
// @route   POST /api/experiments
// @access  Private/Admin
exports.createExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.create({
      ...req.body,
      createdBy: req.user.id
    })

    res.status(201).json({
      success: true,
      experiment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all experiments
// @route   GET /api/experiments
// @access  Private/Admin
exports.getExperiments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    const query = {}
    if (status) query.status = status

    const experiments = await Experiment.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Experiment.countDocuments(query)

    res.status(200).json({
      success: true,
      experiments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single experiment
// @route   GET /api/experiments/:id
// @access  Private/Admin
exports.getExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate('createdBy', 'name email')

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    // Calculate results
    const results = await experimentService.calculateResults(experiment._id)

    res.status(200).json({
      success: true,
      experiment,
      results
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update experiment
// @route   PUT /api/experiments/:id
// @access  Private/Admin
exports.updateExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      experiment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Start experiment
// @route   POST /api/experiments/:id/start
// @access  Private/Admin
exports.startExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.id)

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    experiment.status = 'running'
    if (!experiment.startDate) {
      experiment.startDate = Date.now()
    }

    await experiment.save()

    res.status(200).json({
      success: true,
      experiment,
      message: 'Experiment başlatıldı'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Pause experiment
// @route   POST /api/experiments/:id/pause
// @access  Private/Admin
exports.pauseExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.id)

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    experiment.status = 'paused'
    await experiment.save()

    res.status(200).json({
      success: true,
      experiment,
      message: 'Experiment duraklatıldı'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Complete experiment
// @route   POST /api/experiments/:id/complete
// @access  Private/Admin
exports.completeExperiment = async (req, res, next) => {
  try {
    const { winner, notes } = req.body
    const experiment = await Experiment.findById(req.params.id)

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    const results = await experimentService.calculateResults(experiment._id)

    experiment.status = 'completed'
    experiment.endDate = Date.now()
    experiment.results = {
      winner: winner || results.winner,
      confidence: results.significance?.confidence,
      uplift: results.uplift,
      completedAt: Date.now(),
      notes
    }

    await experiment.save()

    res.status(200).json({
      success: true,
      experiment,
      results,
      message: 'Experiment tamamlandı'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get active experiments for page (Public API)
// @route   GET /api/experiments/active/:page
// @access  Public
exports.getActiveExperimentsForPage = async (req, res, next) => {
  try {
    const { page } = req.params
    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    const experiments = await experimentService.getActiveExperiments(
      page,
      userId,
      anonymousId
    )

    res.status(200).json({
      success: true,
      experiments
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Track experiment event
// @route   POST /api/experiments/track
// @access  Public
exports.trackEvent = async (req, res, next) => {
  try {
    const { experimentId, eventType, metadata } = req.body
    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    await experimentService.trackEvent(
      experimentId,
      userId,
      anonymousId,
      eventType,
      metadata
    )

    res.status(200).json({
      success: true,
      message: 'Event tracked'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete experiment
// @route   DELETE /api/experiments/:id
// @access  Private/Admin
exports.deleteExperiment = async (req, res, next) => {
  try {
    const experiment = await Experiment.findByIdAndDelete(req.params.id)

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Experiment silindi'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports