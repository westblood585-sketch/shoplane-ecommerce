const cron = require('node-cron')
const User = require('../models/User')
const recommendationService = require('../services/recommendationService')

// Her gün gece 02:00'da tüm aktif kullanıcılar için öneriler oluştur
const generateDailyRecommendations = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🔄 Generating daily recommendations...')

      // Son 30 gün içinde aktif olan kullanıcılar
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const activeUsers = await User.find({
        lastLogin: { $gte: thirtyDaysAgo }
      }).select('_id')

      let successCount = 0
      let errorCount = 0

      for (const user of activeUsers) {
        try {
          // Farklı tip öneriler oluştur
          await Promise.all([
            recommendationService.generatePersonalizedRecommendations(user._id, 20),
            recommendationService.generateCollaborativeRecommendations(user._id, 10),
            recommendationService.generateTrendingRecommendations(user._id, 10)
          ])

          successCount++
        } catch (error) {
          console.error(`Error generating recommendations for user ${user._id}:`, error)
          errorCount++
        }

        // Her 100 kullanıcıda bir log
        if ((successCount + errorCount) % 100 === 0) {
          console.log(`Progress: ${successCount + errorCount}/${activeUsers.length}`)
        }
      }

      console.log(`✅ Daily recommendations generated. Success: ${successCount}, Errors: ${errorCount}`)
    } catch (error) {
      console.error('Daily recommendations error:', error)
    }
  })
}

// Her hafta Pazar günü saat 03:00'da kullanıcı davranışlarını temizle
const cleanupOldBehaviors = () => {
  cron.schedule('0 3 * * 0', async () => {
    try {
      console.log('🧹 Cleaning up old user behaviors...')

      const UserBehavior = require('../models/UserBehavior')
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      // 90 günden eski görüntülemeleri sil
      const result = await UserBehavior.updateMany(
        {},
        {
          $pull: {
            viewedProducts: { timestamp: { $lt: ninetyDaysAgo } },
            searches: { timestamp: { $lt: ninetyDaysAgo } },
            cartActions: { timestamp: { $lt: ninetyDaysAgo } }
          }
        }
      )

      console.log(`✅ Cleaned up behaviors for ${result.modifiedCount} users`)
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  })
}

// Her saat başı trend ürünleri güncelle
const updateTrendingProducts = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('📈 Updating trending products...')

      // Tüm kullanıcılar için trending önerileri güncelle
      // (Lightweight, cache'lenebilir)
      const Product = require('../models/Product')
      const Order = require('../models/Order')

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const trending = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: { $in: ['processing', 'shipped', 'delivered'] }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            salesCount: { $sum: '$items.quantity' }
          }
        },
        { $sort: { salesCount: -1 } },
        { $limit: 50 }
      ])

      // Cache'e kaydet (Redis kullanılabilir)
      global.trendingProducts = trending

      console.log(`✅ Updated ${trending.length} trending products`)
    } catch (error) {
      console.error('Trending update error:', error)
    }
  })
}

// Purchase'dan sonra collaborative filtering güncelle
const updateCollaborativeOnPurchase = async (userId, orderItems) => {
  try {
    // Satın alınan ürünlerin kategorilerini güncelle
    const UserBehavior = require('../models/UserBehavior')
    const Product = require('../models/Product')

    let behavior = await UserBehavior.findOne({ user: userId })
    if (!behavior) {
      behavior = await UserBehavior.create({ user: userId })
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product)
      if (product) {
        behavior.updateCategoryPreference(product.category, 5)
        behavior.updateBrandPreference(product.brand, 5)
        behavior.updatePriceRange(product.price)
        
        behavior.purchaseStats.totalOrders += 1
        behavior.purchaseStats.totalSpent += item.price * item.quantity
      }
    }

    behavior.purchaseStats.averageOrderValue = 
      behavior.purchaseStats.totalSpent / behavior.purchaseStats.totalOrders

    await behavior.save()

    // Yeni öneriler oluştur
    await recommendationService.generateCollaborativeRecommendations(userId, 10)
    await recommendationService.generatePersonalizedRecommendations(userId, 20)
  } catch (error) {
    console.error('Collaborative update error:', error)
  }
}

// Tüm jobları başlat
const startRecommendationJobs = () => {
  console.log('🤖 Recommendation jobs started!')
  generateDailyRecommendations()
  cleanupOldBehaviors()
  updateTrendingProducts()
}

module.exports = { 
  startRecommendationJobs,
  updateCollaborativeOnPurchase
}