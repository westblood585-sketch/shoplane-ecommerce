const recommendationService = require('../services/recommendationService')
const UserBehavior = require('../models/UserBehavior')
const Product = require('../models/Product')

// @desc    Ana sayfa için öneriler
// @route   GET /api/recommendations/home
// @access  Private
exports.getHomeRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Paralel olarak farklı tip öneriler al
    const [
      personalized,
      trending,
      collaborative
    ] = await Promise.all([
      recommendationService.generatePersonalizedRecommendations(userId, 10),
      recommendationService.generateTrendingRecommendations(userId, 10),
      recommendationService.generateCollaborativeRecommendations(userId, 10)
    ])

    res.status(200).json({
      success: true,
      recommendations: {
        personalized,
        trending,
        collaborative
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ürün detay sayfası için öneriler
// @route   GET /api/recommendations/product/:productId
// @access  Public
exports.getProductRecommendations = async (req, res, next) => {
  try {
    const { productId } = req.params
    const userId = req.user?.id

    // Paralel olarak öneriler al
    const [
      similar,
      frequentlyBought
    ] = await Promise.all([
      recommendationService.generateContentBasedRecommendations(userId, productId, 8),
      recommendationService.generateFrequentlyBoughtTogether(userId, productId, 6)
    ])

    res.status(200).json({
      success: true,
      recommendations: {
        similar,
        frequentlyBought
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Kullanıcı davranışını kaydet (view)
// @route   POST /api/recommendations/track/view
// @access  Private
exports.trackProductView = async (req, res, next) => {
  try {
    const { productId, duration, source } = req.body
    const userId = req.user.id

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    // UserBehavior bul veya oluştur
    let behavior = await UserBehavior.findOne({ user: userId })
    
    if (!behavior) {
      behavior = await UserBehavior.create({ user: userId })
    }

    // Görüntüleme ekle
    behavior.viewedProducts.push({
      product: productId,
      duration,
      source
    })

    // Son 100 görüntülemeyi tut
    if (behavior.viewedProducts.length > 100) {
      behavior.viewedProducts = behavior.viewedProducts.slice(-100)
    }

    // Kategori ve marka tercihlerini güncelle
    behavior.updateCategoryPreference(product.category, 1)
    behavior.updateBrandPreference(product.brand, 1)
    behavior.updatePriceRange(product.price)

    await behavior.save()

    res.status(200).json({
      success: true,
      message: 'Davranış kaydedildi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Arama davranışını kaydet
// @route   POST /api/recommendations/track/search
// @access  Private
exports.trackSearch = async (req, res, next) => {
  try {
    const { query, resultsCount, clickedProducts } = req.body
    const userId = req.user.id

    let behavior = await UserBehavior.findOne({ user: userId })
    
    if (!behavior) {
      behavior = await UserBehavior.create({ user: userId })
    }

    behavior.searches.push({
      query,
      resultsCount,
      clickedProducts
    })

    // Son 50 aramayı tut
    if (behavior.searches.length > 50) {
      behavior.searches = behavior.searches.slice(-50)
    }

    await behavior.save()

    res.status(200).json({
      success: true,
      message: 'Arama kaydedildi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sepet aksiyonunu kaydet
// @route   POST /api/recommendations/track/cart
// @access  Private
exports.trackCartAction = async (req, res, next) => {
  try {
    const { action, productId } = req.body
    const userId = req.user.id

    let behavior = await UserBehavior.findOne({ user: userId })
    
    if (!behavior) {
      behavior = await UserBehavior.create({ user: userId })
    }

    behavior.cartActions.push({
      action,
      product: productId
    })

    // Sepete eklenen ürünlerin kategori/marka tercihini artır
    if (action === 'add') {
      const product = await Product.findById(productId)
      if (product) {
        behavior.updateCategoryPreference(product.category, 3)
        behavior.updateBrandPreference(product.brand, 3)
      }
    }

    await behavior.save()

    res.status(200).json({
      success: true,
      message: 'Sepet aksiyonu kaydedildi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Öneri performans istatistikleri (Admin)
// @route   GET /api/recommendations/admin/stats
// @access  Private/Admin
exports.getRecommendationStats = async (req, res, next) => {
  try {
    const Recommendation = require('../models/Recommendation')
    
    const stats = await Recommendation.aggregate([
      {
        $group: {
          _id: '$type',
          totalRecommendations: { $sum: 1 },
          avgImpressions: { $avg: '$impressions' },
          avgClicks: { $avg: '$clicks' },
          avgConversions: { $avg: '$conversions' },
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalConversions: { $sum: '$conversions' }
        }
      },
      {
        $project: {
          type: '$_id',
          totalRecommendations: 1,
          avgImpressions: { $round: ['$avgImpressions', 2] },
          avgClicks: { $round: ['$avgClicks', 2] },
          avgConversions: { $round: ['$avgConversions', 2] },
          totalImpressions: 1,
          totalClicks: 1,
          totalConversions: 1,
          ctr: {
            $cond: [
              { $gt: ['$totalImpressions', 0] },
              { $multiply: [{ $divide: ['$totalClicks', '$totalImpressions'] }, 100] },
              0
            ]
          },
          conversionRate: {
            $cond: [
              { $gt: ['$totalClicks', 0] },
              { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] },
              0
            ]
          }
        }
      }
    ])

    res.status(200).json({
      success: true,
      stats
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports