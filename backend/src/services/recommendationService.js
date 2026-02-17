const Recommendation = require('../models/Recommendation')
const UserBehavior = require('../models/UserBehavior')
const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')

class RecommendationService {
  // 1. Collaborative Filtering - Benzer kullanıcılara göre öneriler
  async generateCollaborativeRecommendations(userId, limit = 10) {
    try {
      // Kullanıcının satın aldığı ürünler
      const userOrders = await Order.find({ user: userId })
        .populate('items.product')
      
      const userProducts = new Set()
      userOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.product) {
            userProducts.add(item.product._id.toString())
          }
        })
      })

      if (userProducts.size === 0) {
        return this.generateTrendingRecommendations(userId, limit)
      }

      // Aynı ürünleri alan diğer kullanıcıları bul
      const similarUsers = await Order.aggregate([
        {
          $match: {
            'items.product': { 
              $in: Array.from(userProducts).map(id => require('mongoose').Types.ObjectId(id))
            },
            user: { $ne: require('mongoose').Types.ObjectId(userId) }
          }
        },
        {
          $group: {
            _id: '$user',
            commonProducts: { $addToSet: '$items.product' },
            orderCount: { $sum: 1 }
          }
        },
        {
          $project: {
            userId: '$_id',
            similarity: { $size: '$commonProducts' },
            orderCount: 1
          }
        },
        { $sort: { similarity: -1 } },
        { $limit: 50 }
      ])

      // Benzer kullanıcıların satın aldığı ama bizim kullanıcının almadığı ürünler
      const recommendedProducts = new Map()
      
      for (const similarUser of similarUsers) {
        const theirOrders = await Order.find({ user: similarUser.userId })
          .populate('items.product')
        
        theirOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.product && !userProducts.has(item.product._id.toString())) {
              const productId = item.product._id.toString()
              const currentScore = recommendedProducts.get(productId) || 0
              recommendedProducts.set(
                productId, 
                currentScore + (similarUser.similarity / similarUsers.length)
              )
            }
          })
        })
      }

      // Skorlara göre sırala
      const sorted = Array.from(recommendedProducts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)

      const products = await Product.find({
        _id: { $in: sorted.map(([id]) => id) },
        isActive: true,
        stock: { $gt: 0 }
      })

      const recommendations = sorted.map(([productId, score]) => ({
        product: products.find(p => p._id.toString() === productId),
        score: Math.round(score * 100),
        reason: 'Benzer kullanıcıların beğendiği ürünler'
      })).filter(r => r.product)

      // Kaydet
      await this.saveRecommendation(userId, 'collaborative', recommendations)

      return recommendations
    } catch (error) {
      console.error('Collaborative filtering error:', error)
      return []
    }
  }

  // 2. Content-Based - Ürün özelliklerine göre
  async generateContentBasedRecommendations(userId, productId, limit = 10) {
    try {
      const baseProduct = await Product.findById(productId)
      if (!baseProduct) return []

      // Aynı kategoride, benzer fiyat aralığında ürünler
      const priceRange = baseProduct.price * 0.3 // ±30%
      
      const similarProducts = await Product.find({
        _id: { $ne: productId },
        category: baseProduct.category,
        price: {
          $gte: baseProduct.price - priceRange,
          $lte: baseProduct.price + priceRange
        },
        isActive: true,
        stock: { $gt: 0 }
      })
      .limit(limit)
      .sort({ rating: -1, soldCount: -1 })

      const recommendations = similarProducts.map((product, index) => ({
        product,
        score: 100 - (index * 5),
        reason: `${baseProduct.name} ile benzer özelliklere sahip`
      }))

      await this.saveRecommendation(userId, 'content_based', recommendations, productId)

      return recommendations
    } catch (error) {
      console.error('Content-based error:', error)
      return []
    }
  }

  // 3. Frequently Bought Together
  async generateFrequentlyBoughtTogether(userId, productId, limit = 5) {
    try {
      // Bu ürünü içeren siparişleri bul
      const ordersWithProduct = await Order.find({
        'items.product': productId,
        status: 'delivered'
      }).populate('items.product')

      // Birlikte alınan ürünleri say
      const productCounts = new Map()
      
      ordersWithProduct.forEach(order => {
        order.items.forEach(item => {
          if (item.product && item.product._id.toString() !== productId.toString()) {
            const id = item.product._id.toString()
            productCounts.set(id, (productCounts.get(id) || 0) + 1)
          }
        })
      })

      // En çok birlikte alınanları sırala
      const sorted = Array.from(productCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)

      const products = await Product.find({
        _id: { $in: sorted.map(([id]) => id) },
        isActive: true,
        stock: { $gt: 0 }
      })

      const recommendations = sorted.map(([productId, count]) => ({
        product: products.find(p => p._id.toString() === productId),
        score: Math.min(100, count * 10),
        reason: `${count} kişi birlikte aldı`
      })).filter(r => r.product)

      await this.saveRecommendation(
        userId, 
        'frequently_bought_together', 
        recommendations, 
        productId
      )

      return recommendations
    } catch (error) {
      console.error('Frequently bought together error:', error)
      return []
    }
  }

  // 4. Trending Products
  async generateTrendingRecommendations(userId, limit = 10) {
    try {
      // Son 7 gün içinde en çok satılanlar
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
            salesCount: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { salesCount: -1 } },
        { $limit: limit }
      ])

      const productIds = trending.map(t => t._id)
      const products = await Product.find({
        _id: { $in: productIds },
        isActive: true,
        stock: { $gt: 0 }
      })

      const recommendations = trending.map((item, index) => ({
        product: products.find(p => p._id.toString() === item._id.toString()),
        score: 100 - (index * 5),
        reason: `Son 7 günde ${item.salesCount} satış`
      })).filter(r => r.product)

      await this.saveRecommendation(userId, 'trending', recommendations)

      return recommendations
    } catch (error) {
      console.error('Trending error:', error)
      return []
    }
  }

  // 5. Personalized - Kullanıcı davranışına göre
  async generatePersonalizedRecommendations(userId, limit = 20) {
    try {
      let behavior = await UserBehavior.findOne({ user: userId })
      
      if (!behavior || behavior.viewedProducts.length === 0) {
        return this.generateTrendingRecommendations(userId, limit)
      }

      const recommendations = []

      // En çok baktığı kategorilerden öneriler
      const topCategories = behavior.categoryPreferences
        .slice(0, 3)
        .map(c => c.category)

      if (topCategories.length > 0) {
        const categoryProducts = await Product.find({
          category: { $in: topCategories },
          isActive: true,
          stock: { $gt: 0 }
        })
        .limit(limit / 2)
        .sort({ rating: -1, soldCount: -1 })

        recommendations.push(...categoryProducts.map((product, index) => ({
          product,
          score: 100 - (index * 3),
          reason: 'İlgilendiğiniz kategorilerden'
        })))
      }

      // En çok baktığı markalardan öneriler
      const topBrands = behavior.brandPreferences
        .slice(0, 2)
        .map(b => b.brand)

      if (topBrands.length > 0) {
        const brandProducts = await Product.find({
          brand: { $in: topBrands },
          isActive: true,
          stock: { $gt: 0 }
        })
        .limit(limit / 2)
        .sort({ rating: -1 })

        recommendations.push(...brandProducts.map((product, index) => ({
          product,
          score: 90 - (index * 3),
          reason: 'Beğendiğiniz markalardan'
        })))
      }

      // Fiyat aralığına uygun öneriler
      if (behavior.priceRange.average) {
        const priceRange = behavior.priceRange.average * 0.4
        
        const priceProducts = await Product.find({
          price: {
            $gte: behavior.priceRange.average - priceRange,
            $lte: behavior.priceRange.average + priceRange
          },
          isActive: true,
          stock: { $gt: 0 }
        })
        .limit(limit / 3)
        .sort({ rating: -1 })

        recommendations.push(...priceProducts.map((product, index) => ({
          product,
          score: 85 - (index * 3),
          reason: 'Bütçenize uygun'
        })))
      }

      // Duplicate'leri kaldır ve skorlara göre sırala
      const uniqueRecommendations = []
      const seenProducts = new Set()

      recommendations
        .sort((a, b) => b.score - a.score)
        .forEach(rec => {
          const id = rec.product._id.toString()
          if (!seenProducts.has(id)) {
            seenProducts.add(id)
            uniqueRecommendations.push(rec)
          }
        })

      const final = uniqueRecommendations.slice(0, limit)

      await this.saveRecommendation(userId, 'personalized', final)

      return final
    } catch (error) {
      console.error('Personalized error:', error)
      return []
    }
  }

  // Helper: Save recommendation
  async saveRecommendation(userId, type, products, basedOnProduct = null) {
    try {
      // Eski önerileri sil
      await Recommendation.deleteMany({
        user: userId,
        type,
        ...(basedOnProduct && { basedOnProduct })
      })

      // Yeni öneriyi kaydet
      await Recommendation.create({
        user: userId,
        type,
        products: products.map(p => ({
          product: p.product._id,
          score: p.score,
          reason: p.reason
        })),
        basedOnProduct
      })
    } catch (error) {
      console.error('Save recommendation error:', error)
    }
  }

  // Track impression
  async trackImpression(recommendationId) {
    await Recommendation.findByIdAndUpdate(recommendationId, {
      $inc: { impressions: 1 }
    })
  }

  // Track click
  async trackClick(recommendationId) {
    await Recommendation.findByIdAndUpdate(recommendationId, {
      $inc: { clicks: 1 }
    })
  }

  // Track conversion
  async trackConversion(recommendationId) {
    await Recommendation.findByIdAndUpdate(recommendationId, {
      $inc: { conversions: 1 }
    })
  }
}

module.exports = new RecommendationService()