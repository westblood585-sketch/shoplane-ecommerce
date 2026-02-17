const LoyaltyProgram = require('../models/LoyaltyProgram')
const Reward = require('../models/Reward')
const { v4: uuidv4 } = require('uuid')

class LoyaltyService {
  // Get or create loyalty program
  async getOrCreateProgram(userId) {
    try {
      let program = await LoyaltyProgram.findOne({ user: userId })
      
      if (!program) {
        // Generate referral code
        const referralCode = this.generateReferralCode()
        
        program = await LoyaltyProgram.create({
          user: userId,
          referrals: {
            code: referralCode
          }
        })
        
        // Welcome bonus
        await program.earnPoints(100, 'Welcome bonus! 🎉')
      }
      
      return program
    } catch (error) {
      console.error('Get or create program error:', error)
      throw error
    }
  }

  // Calculate points from order
  calculatePointsFromOrder(orderAmount, tier = 'bronze') {
    const basePoints = Math.floor(orderAmount / 10) // 1 point per 10₺
    
    const multipliers = {
      bronze: 1,
      silver: 1.5,
      gold: 2,
      platinum: 2.5,
      diamond: 3
    }
    
    const multiplier = multipliers[tier] || 1
    
    return Math.floor(basePoints * multiplier)
  }

  // Process order points
  async processOrderPoints(userId, orderId, orderAmount) {
    try {
      const program = await this.getOrCreateProgram(userId)
      
      // Calculate points
      const points = this.calculatePointsFromOrder(orderAmount, program.tier.current)
      
      // Add to pending (will be confirmed after 7 days)
      program.points.pending += points
      
      // Earn points (with 7-day expiry for refund window)
      await program.earnPoints(points, `Purchase #${orderId}`, orderId, 7)
      
      // Update stats
      program.stats.totalOrders += 1
      program.stats.totalSpent += orderAmount
      
      // Update streak
      await program.updateStreak()
      
      // Check achievements
      const newAchievements = await program.checkAchievements()
      
      await program.save()
      
      return {
        pointsEarned: points,
        newTier: program.tier.current,
        newAchievements
      }
    } catch (error) {
      console.error('Process order points error:', error)
      throw error
    }
  }

  // Redeem reward
  async redeemReward(userId, rewardId) {
    try {
      const program = await LoyaltyProgram.findOne({ user: userId })
      const reward = await Reward.findById(rewardId)
      
      if (!program || !reward) {
        throw new Error('Program or reward not found')
      }
      
      // Check if can redeem
      const validation = reward.canRedeem(program)
      if (!validation.canRedeem) {
        throw new Error(validation.reason)
      }
      
      // Generate redemption code
      const code = this.generateRedemptionCode()
      
      // Redeem points
      await program.redeemPoints(
        reward.pointsCost,
        `Redeemed: ${reward.name}`,
        rewardId
      )
      
      // Add to redeemed rewards
      const expiresAt = new Date(Date.now() + reward.expiresAfterDays * 24 * 60 * 60 * 1000)
      
      program.redeemedRewards.push({
        reward: rewardId,
        pointsSpent: reward.pointsCost,
        code,
        expiresAt
      })
      
      await program.save()
      
      // Update reward stats
      await reward.redeem()
      
      return {
        code,
        expiresAt,
        reward
      }
    } catch (error) {
      console.error('Redeem reward error:', error)
      throw error
    }
  }

  // Process referral
  async processReferral(referralCode, newUserId) {
    try {
      const referrer = await LoyaltyProgram.findOne({ 'referrals.code': referralCode })
      
      if (!referrer) {
        return null
      }
      
      // Referrer gets points
      const referralPoints = 500
      await referrer.earnPoints(referralPoints, `Referral bonus: New user joined!`)
      
      referrer.referrals.totalReferrals += 1
      referrer.referrals.pointsEarned += referralPoints
      await referrer.save()
      
      // New user gets welcome bonus
      const newUserProgram = await this.getOrCreateProgram(newUserId)
      await newUserProgram.earnPoints(200, `Referral bonus: Joined via ${referralCode}`)
      
      return {
        referrerPoints: referralPoints,
        newUserPoints: 200
      }
    } catch (error) {
      console.error('Process referral error:', error)
      throw error
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10, period = 'all_time') {
    try {
      let query = {}
      
      if (period !== 'all_time') {
        const now = new Date()
        let startDate
        
        switch (period) {
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7))
            break
        }
        
        if (startDate) {
          query['transactions.earnedAt'] = { $gte: startDate }
        }
      }
      
      const leaderboard = await LoyaltyProgram.find(query)
        .populate('user', 'name email')
        .sort({ 'points.lifetime': -1 })
        .limit(limit)
      
      return leaderboard.map((program, index) => ({
        rank: index + 1,
        user: program.user,
        points: period === 'all_time' ? program.points.lifetime : program.points.current,
        tier: program.tier.current
      }))
    } catch (error) {
      console.error('Get leaderboard error:', error)
      return []
    }
  }

  // Helper: Generate referral code
  generateReferralCode() {
    return 'REF-' + uuidv4().substring(0, 8).toUpperCase()
  }

  // Helper: Generate redemption code
  generateRedemptionCode() {
    return 'RWD-' + uuidv4().substring(0, 12).toUpperCase()
  }
}

module.exports = new LoyaltyService()