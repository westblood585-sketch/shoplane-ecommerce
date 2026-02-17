const LoyaltyProgram = require('../models/LoyaltyProgram')
const Reward = require('../models/Reward')
const loyaltyService = require('../services/loyaltyService')

// @desc    Get my loyalty program
// @route   GET /api/loyalty/my-program
// @access  Private
exports.getMyProgram = async (req, res, next) => {
  try {
    const program = await loyaltyService.getOrCreateProgram(req.user.id)
    
    // Expire old points
    await program.expirePoints()

    res.status(200).json({
      success: true,
      program
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get available rewards
// @route   GET /api/loyalty/rewards
// @access  Public
exports.getRewards = async (req, res, next) => {
  try {
    const { type, featured, minPoints, maxPoints } = req.query

    const query = { isActive: true }

    if (type) query.type = type
    if (featured) query.featured = featured === 'true'
    if (minPoints || maxPoints) {
      query.pointsCost = {}
      if (minPoints) query.pointsCost.$gte = parseInt(minPoints)
      if (maxPoints) query.pointsCost.$lte = parseInt(maxPoints)
    }

    const rewards = await Reward.find(query)
      .sort({ pointsCost: 1 })

    // Filter available rewards
    const availableRewards = rewards.filter(r => r.isAvailable)

    res.status(200).json({
      success: true,
      rewards: availableRewards
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Redeem reward
// @route   POST /api/loyalty/redeem/:rewardId
// @access  Private
exports.redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.params

    const result = await loyaltyService.redeemReward(req.user.id, rewardId)

    res.status(200).json({
      success: true,
      message: 'Reward redeemed successfully!',
      ...result
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get my redeemed rewards
// @route   GET /api/loyalty/my-rewards
// @access  Private
exports.getMyRewards = async (req, res, next) => {
  try {
    const program = await LoyaltyProgram.findOne({ user: req.user.id })
      .populate('redeemedRewards.reward')

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found'
      })
    }

    res.status(200).json({
      success: true,
      rewards: program.redeemedRewards
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Use reward code
// @route   POST /api/loyalty/use-reward
// @access  Private
exports.useReward = async (req, res, next) => {
  try {
    const { code } = req.body

    const program = await LoyaltyProgram.findOne({ user: req.user.id })
      .populate('redeemedRewards.reward')

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found'
      })
    }

    const rewardIndex = program.redeemedRewards.findIndex(
      r => r.code === code && !r.used
    )

    if (rewardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or already used code'
      })
    }

    const reward = program.redeemedRewards[rewardIndex]

    // Check expiry
    if (reward.expiresAt && new Date() > reward.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Reward has expired'
      })
    }

    // Mark as used
    program.redeemedRewards[rewardIndex].used = true
    program.redeemedRewards[rewardIndex].usedAt = Date.now()
    await program.save()

    res.status(200).json({
      success: true,
      message: 'Reward applied successfully',
      reward: program.redeemedRewards[rewardIndex]
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Apply referral code
// @route   POST /api/loyalty/referral
// @access  Private
exports.applyReferralCode = async (req, res, next) => {
  try {
    const { code } = req.body

    const result = await loyaltyService.processReferral(code, req.user.id)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Referral bonus applied!',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get leaderboard
// @route   GET /api/loyalty/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, period = 'all_time' } = req.query

    const leaderboard = await loyaltyService.getLeaderboard(
      parseInt(limit),
      period
    )

    res.status(200).json({
      success: true,
      leaderboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get transaction history
// @route   GET /api/loyalty/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query

    const program = await LoyaltyProgram.findOne({ user: req.user.id })

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found'
      })
    }

    let transactions = program.transactions

    if (type) {
      transactions = transactions.filter(t => t.type === type)
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => b.earnedAt - a.earnedAt)

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedTransactions = transactions.slice(startIndex, endIndex)

    res.status(200).json({
      success: true,
      transactions: paginatedTransactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(transactions.length / limit),
      total: transactions.length
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create reward (Admin)
// @route   POST /api/loyalty/admin/rewards
// @access  Private/Admin
exports.createReward = async (req, res, next) => {
  try {
    const reward = await Reward.create(req.body)

    res.status(201).json({
      success: true,
      reward
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update reward (Admin)
// @route   PUT /api/loyalty/admin/rewards/:id
// @access  Private/Admin
exports.updateReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      })
    }

    res.status(200).json({
      success: true,
      reward
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete reward (Admin)
// @route   DELETE /api/loyalty/admin/rewards/:id
// @access  Private/Admin
exports.deleteReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id)

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Reward deleted'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get loyalty stats (Admin)
// @route   GET /api/loyalty/admin/stats
// @access  Private/Admin
exports.getLoyaltyStats = async (req, res, next) => {
  try {
    const totalPrograms = await LoyaltyProgram.countDocuments()
    const activePrograms = await LoyaltyProgram.countDocuments({ isActive: true })

    const tierDistribution = await LoyaltyProgram.aggregate([
      {
        $group: {
          _id: '$tier.current',
          count: { $sum: 1 }
        }
      }
    ])

    const totalPointsIssued = await LoyaltyProgram.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$points.lifetime' }
        }
      }
    ])

    const totalPointsRedeemed = await LoyaltyProgram.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$stats.totalRedeemed' }
        }
      }
    ])

    res.status(200).json({
      success: true,
      stats: {
        totalPrograms,
        activePrograms,
        tierDistribution,
        totalPointsIssued: totalPointsIssued[0]?.total || 0,
        totalPointsRedeemed: totalPointsRedeemed[0]?.total || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports