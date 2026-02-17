const Influencer = require('../models/Influencer')
const Referral = require('../models/Referral')
const Order = require('../models/Order')
const User = require('../models/User')

// @desc    Influencer başvurusu yap
// @route   POST /api/influencers/apply
// @access  Private
exports.applyAsInfluencer = async (req, res, next) => {
  try {
    const {
      displayName,
      bio,
      socialMedia,
      followers,
      platform,
      reason
    } = req.body

    // Daha önce başvuru var mı?
    const existing = await Influencer.findOne({ user: req.user.id })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Zaten bir başvurunuz var'
      })
    }

    const influencer = await Influencer.create({
      user: req.user.id,
      displayName,
      bio,
      socialMedia,
      application: {
        followers,
        platform,
        reason,
        submittedAt: Date.now()
      }
    })

    res.status(201).json({
      success: true,
      influencer,
      message: 'Başvurunuz alındı. İnceleme süreci 3-5 iş günü sürecektir.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Kendi influencer profilini getir
// @route   GET /api/influencers/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user.id })
      .populate('user', 'name email')

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profili bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      influencer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Dashboard istatistikleri
// @route   GET /api/influencers/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user.id })

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profili bulunamadı'
      })
    }

    // Son 30 gün istatistikleri
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const referral = await Referral.findOne({ influencer: influencer._id })

    // Son 30 gün siparişleri
    const recentOrders = referral?.orders.filter(o => 
      new Date(o.createdAt) >= thirtyDaysAgo
    ) || []

    const last30DaysStats = {
      clicks: referral?.clicks.filter(c => 
        new Date(c.timestamp) >= thirtyDaysAgo
      ).length || 0,
      orders: recentOrders.length,
      sales: recentOrders.reduce((sum, o) => sum + o.orderTotal, 0),
      earnings: recentOrders.reduce((sum, o) => sum + o.commission, 0)
    }

    // Top ürünler
    const topProducts = await this.getTopProducts(influencer._id)

    res.status(200).json({
      success: true,
      dashboard: {
        overall: influencer.stats,
        last30Days: last30DaysStats,
        topProducts,
        pendingEarnings: influencer.pendingEarnings,
        tier: influencer.tier,
        commissionRate: influencer.getCommissionRate()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Referral link'e tıklama kaydet
// @route   POST /api/influencers/track-click
// @access  Public
exports.trackClick = async (req, res, next) => {
  try {
    const { referralCode } = req.body
    const ip = req.ip
    const userAgent = req.headers['user-agent']
    const referer = req.headers['referer']

    const influencer = await Influencer.findOne({ referralCode })

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Geçersiz referral kodu'
      })
    }

    // Referral kaydı bul veya oluştur
    let referral = await Referral.findOne({ influencer: influencer._id })
    if (!referral) {
      referral = await Referral.create({
        influencer: influencer._id,
        referralCode
      })
    }

    // Tıklama kaydet
    referral.clicks.push({
      ip,
      userAgent,
      referer
    })
    referral.totalClicks += 1

    // Unique click (IP bazlı basit kontrol)
    const uniqueIPs = [...new Set(referral.clicks.map(c => c.ip))]
    referral.uniqueClicks = uniqueIPs.length

    await referral.save()

    // Influencer stats güncelle
    influencer.stats.totalClicks += 1
    await influencer.save()

    res.status(200).json({
      success: true,
      message: 'Tıklama kaydedildi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sipariş komisyonu kaydet
// @route   POST /api/influencers/track-order
// @access  Private (Order Service tarafından çağrılır)
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderId, referralCode } = req.body

    const influencer = await Influencer.findOne({ referralCode })
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer bulunamadı'
      })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      })
    }

    // Komisyon hesapla
    const commissionRate = influencer.getCommissionRate()
    const commission = (order.totalPrice * commissionRate) / 100

    // Referral kaydına ekle
    let referral = await Referral.findOne({ influencer: influencer._id })
    if (!referral) {
      referral = await Referral.create({
        influencer: influencer._id,
        referralCode
      })
    }

    referral.orders.push({
      order: order._id,
      orderNumber: order.orderNumber,
      customer: order.user,
      orderTotal: order.totalPrice,
      commission,
      commissionRate,
      status: 'pending'
    })

    referral.totalOrders += 1
    referral.totalSales += order.totalPrice
    referral.totalCommission += commission

    await referral.save()

    // Influencer stats güncelle
    influencer.stats.totalOrders += 1
    influencer.stats.totalSales += order.totalPrice
    influencer.stats.totalEarnings += commission
    influencer.pendingEarnings += commission
    influencer.updateConversionRate()
    influencer.updateAverageOrderValue()
    influencer.updateTier()

    await influencer.save()

    res.status(200).json({
      success: true,
      commission,
      message: 'Komisyon kaydedildi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ödeme talep et
// @route   POST /api/influencers/request-payout
// @access  Private
exports.requestPayout = async (req, res, next) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user.id })

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profili bulunamadı'
      })
    }

    if (influencer.pendingEarnings < influencer.minimumPayout) {
      return res.status(400).json({
        success: false,
        message: `Minimum ödeme tutarı ${influencer.minimumPayout}₺'dir`
      })
    }

    // Payout request oluştur (ayrı model gerekebilir)
    // Şimdilik basit email gönderelim
    
    res.status(200).json({
      success: true,
      message: 'Ödeme talebiniz alındı. 3-5 iş günü içinde hesabınıza aktarılacaktır.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Profil güncelle
// @route   PUT /api/influencers/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user.id })

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profili bulunamadı'
      })
    }

    const {
      displayName,
      bio,
      socialMedia,
      paymentInfo,
      notificationPreferences
    } = req.body

    if (displayName) influencer.displayName = displayName
    if (bio) influencer.bio = bio
    if (socialMedia) influencer.socialMedia = { ...influencer.socialMedia, ...socialMedia }
    if (paymentInfo) influencer.paymentInfo = { ...influencer.paymentInfo, ...paymentInfo }
    if (notificationPreferences) {
      influencer.notificationPreferences = { 
        ...influencer.notificationPreferences, 
        ...notificationPreferences 
      }
    }

    await influencer.save()

    res.status(200).json({
      success: true,
      influencer,
      message: 'Profil güncellendi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tüm influencerları getir (Admin)
// @route   GET /api/influencers/admin/all
// @access  Private/Admin
exports.getAllInfluencers = async (req, res, next) => {
  try {
    const { status, tier, page = 1, limit = 20 } = req.query

    const query = {}
    if (status) query.status = status
    if (tier) query.tier = tier

    const influencers = await Influencer.find(query)
      .populate('user', 'name email')
      .sort({ 'stats.totalSales': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Influencer.countDocuments(query)

    res.status(200).json({
      success: true,
      influencers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Başvuruyu onayla/reddet (Admin)
// @route   PUT /api/influencers/admin/:id/review
// @access  Private/Admin
exports.reviewApplication = async (req, res, next) => {
  try {
    const { approved, rejectionReason } = req.body

    const influencer = await Influencer.findById(req.params.id)
    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer bulunamadı'
      })
    }

    influencer.status = approved ? 'approved' : 'rejected'
    influencer.application.reviewedAt = Date.now()
    influencer.application.reviewedBy = req.user.id

    if (!approved && rejectionReason) {
      influencer.application.rejectionReason = rejectionReason
    }

    await influencer.save()

    // Email gönder (başvuru sonucu)

    res.status(200).json({
      success: true,
      influencer,
      message: approved ? 'Başvuru onaylandı' : 'Başvuru reddedildi'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports