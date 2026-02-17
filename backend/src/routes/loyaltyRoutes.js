const express = require('express')
const router = express.Router()
const {
  getMyProgram,
  getRewards,
  redeemReward,
  getMyRewards,
  useReward,
  applyReferralCode,
  getLeaderboard,
  getTransactions,
  createReward,
  updateReward,
  deleteReward,
  getLoyaltyStats
} = require('../controllers/loyaltyController')
const { protect, authorize } = require('../middleware/auth')

// Public routes
router.get('/rewards', getRewards)
router.get('/leaderboard', getLeaderboard)

// Protected routes
router.get('/my-program', protect, getMyProgram)
router.post('/redeem/:rewardId', protect, redeemReward)
router.get('/my-rewards', protect, getMyRewards)
router.post('/use-reward', protect, useReward)
router.post('/referral', protect, applyReferralCode)
router.get('/transactions', protect, getTransactions)

// Admin routes
router.post('/admin/rewards', protect, authorize('admin'), createReward)
router.put('/admin/rewards/:id', protect, authorize('admin'), updateReward)
router.delete('/admin/rewards/:id', protect, authorize('admin'), deleteReward)
router.get('/admin/stats', protect, authorize('admin'), getLoyaltyStats)

module.exports = router