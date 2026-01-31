const User = require('../models/User')

// Rozet tanımları
const badges = {
  first_order: {
    id: 'first_order',
    name: 'İlk Alışveriş',
    description: 'İlk siparişini verdin!',
    icon: '🎉',
    points: 100
  },
  loyal_customer: {
    id: 'loyal_customer',
    name: 'Sadık Müşteri',
    description: '10 sipariş tamamladın!',
    icon: '⭐',
    points: 500
  },
  big_spender: {
    id: 'big_spender',
    name: 'Büyük Alışveriş',
    description: 'Tek siparişte 5000₺ üzeri harcadın!',
    icon: '💎',
    points: 300
  },
  reviewer: {
    id: 'reviewer',
    name: 'Yorum Ustası',
    description: '10 ürün yorumu yaptın!',
    icon: '✍️',
    points: 200
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: 'Sosyal Kelebek',
    description: '5 arkadaşını getirdin!',
    icon: '🦋',
    points: 1000
  }
}

// @desc    Kullanıcı profili (gamification ile)
// @route   GET /api/gamification/profile
// @access  Private
const getGamificationProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name email gamification')
    
    // Level progress
    const currentLevel = user.gamification.level
    const currentPoints = user.gamification.points
    const pointsForCurrentLevel = (currentLevel - 1) * 1000
    const pointsForNextLevel = currentLevel * 1000
    const progressToNextLevel = ((currentPoints - pointsForCurrentLevel) / 1000) * 100

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        level: user.gamification.level,
        points: user.gamification.points,
        badges: user.gamification.badges,
        progressToNextLevel: Math.min(100, progressToNextLevel),
        pointsToNextLevel: Math.max(0, pointsForNextLevel - currentPoints),
        dailySpinAvailable: user.gamification.dailySpinAvailable,
        stats: {
          totalOrders: user.gamification.totalOrders,
          totalSpent: user.gamification.totalSpent
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Daily Spin Wheel
// @route   POST /api/gamification/spin
// @access  Private
const spinWheel = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    // Kontrol: Bugün çevrildi mi?
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (user.gamification.lastSpinDate) {
      const lastSpin = new Date(user.gamification.lastSpinDate)
      lastSpin.setHours(0, 0, 0, 0)
      
      if (lastSpin.getTime() === today.getTime()) {
        return res.status(400).json({
          success: false,
          message: 'Bugün çarkı çevirme hakkın doldu. Yarın tekrar dene!'
        })
      }
    }

    // Ödüller (ağırlıklı rastgele)
    const prizes = [
      { type: 'points', value: 50, weight: 30, label: '50 Puan' },
      { type: 'points', value: 100, weight: 25, label: '100 Puan' },
      { type: 'points', value: 200, weight: 15, label: '200 Puan' },
      { type: 'points', value: 500, weight: 8, label: '500 Puan' },
      { type: 'discount', value: 10, weight: 10, label: '%10 İndirim' },
      { type: 'discount', value: 20, weight: 7, label: '%20 İndirim' },
      { type: 'discount', value: 50, weight: 3, label: '%50 İndirim' },
      { type: 'free_shipping', value: 1, weight: 2, label: 'Ücretsiz Kargo' }
    ]

    // Ağırlıklı rastgele seçim
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0)
    let random = Math.random() * totalWeight
    let selectedPrize = prizes[0]

    for (const prize of prizes) {
      random -= prize.weight
      if (random <= 0) {
        selectedPrize = prize
        break
      }
    }

    // Ödülü uygula
    if (selectedPrize.type === 'points') {
      await user.addPoints(selectedPrize.value, 'Daily Spin')
    }

    // Spin durumunu güncelle
    user.gamification.dailySpinAvailable = false
    user.gamification.lastSpinDate = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      prize: selectedPrize
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tüm rozetler
// @route   GET /api/gamification/badges
// @access  Private
const getAllBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const earnedBadgeIds = user.gamification.badges.map(b => b.id)

    const allBadges = Object.values(badges).map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
      earnedAt: user.gamification.badges.find(b => b.id === badge.id)?.earnedAt
    }))

    res.status(200).json({
      success: true,
      badges: allBadges
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ 'gamification.points': { $gt: 0 } })
      .select('name gamification.points gamification.level')
      .sort({ 'gamification.points': -1 })
      .limit(10)

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.gamification.points,
      level: user.gamification.level
    }))

    // Mevcut kullanıcının sırası
    const currentUser = await User.findById(req.user.id)
    const currentUserRank = await User.countDocuments({
      'gamification.points': { $gt: currentUser.gamification.points }
    }) + 1

    res.status(200).json({
      success: true,
      leaderboard,
      currentUserRank,
      currentUserPoints: currentUser.gamification.points
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGamificationProfile,
  spinWheel,
  getAllBadges,
  getLeaderboard,
  badges
}