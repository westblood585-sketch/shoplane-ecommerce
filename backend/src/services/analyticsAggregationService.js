const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const LoyaltyProgram = require('../models/LoyaltyProgram')
const CustomerJourney = require('../models/CustomerJourney')
const Bundle = require('../models/Bundle')

class AnalyticsAggregationService {
  // Get comprehensive dashboard data
  async getDashboardOverview(startDate, endDate) {
    try {
      const dateFilter = this.getDateFilter(startDate, endDate)

      const [
        revenue,
        orders,
        customers,
        products,
        topProducts,
        categoryPerformance,
        revenueByDay,
        conversionFunnel,
        customerLifetimeValue,
        bundlePerformance
      ] = await Promise.all([
        this.getRevenueMetrics(dateFilter),
        this.getOrderMetrics(dateFilter),
        this.getCustomerMetrics(dateFilter),
        this.getProductMetrics(),
        this.getTopProducts(dateFilter, 10),
        this.getCategoryPerformance(dateFilter),
        this.getRevenueByDay(dateFilter),
        this.getConversionFunnel(dateFilter),
        this.getCustomerLifetimeValue(dateFilter),
        this.getBundlePerformance(dateFilter)
      ])

      return {
        revenue,
        orders,
        customers,
        products,
        topProducts,
        categoryPerformance,
        revenueByDay,
        conversionFunnel,
        customerLifetimeValue,
        bundlePerformance
      }
    } catch (error) {
      console.error('Dashboard overview error:', error)
      throw error
    }
  }

  // Revenue metrics
  async getRevenueMetrics(dateFilter) {
    try {
      const currentPeriod = await Order.aggregate([
        { $match: { ...dateFilter, status: { $in: ['processing', 'shipped', 'delivered'] } } },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
            count: { $sum: 1 },
            average: { $avg: '$totalAmount' }
          }
        }
      ])

      // Previous period for comparison
      const periodDays = this.getDaysDifference(dateFilter.createdAt.$gte, dateFilter.createdAt.$lte)
      const previousPeriodStart = new Date(dateFilter.createdAt.$gte)
      previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays)

      const previousPeriod = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousPeriodStart, $lt: dateFilter.createdAt.$gte },
            status: { $in: ['processing', 'shipped', 'delivered'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ])

      const current = currentPeriod[0] || { total: 0, count: 0, average: 0 }
      const previous = previousPeriod[0] || { total: 0 }

      const growth = previous.total > 0
        ? ((current.total - previous.total) / previous.total) * 100
        : 0

      return {
        total: current.total,
        count: current.count,
        average: current.average,
        growth: growth,
        previousPeriod: previous.total
      }
    } catch (error) {
      console.error('Revenue metrics error:', error)
      return { total: 0, count: 0, average: 0, growth: 0 }
    }
  }

  // Order metrics
  async getOrderMetrics(dateFilter) {
    try {
      const [total, byStatus, avgItems] = await Promise.all([
        Order.countDocuments(dateFilter),
        Order.aggregate([
          { $match: dateFilter },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Order.aggregate([
          { $match: dateFilter },
          { $unwind: '$items' },
          { $group: { _id: '$_id', itemCount: { $sum: '$items.quantity' } } },
          { $group: { _id: null, avgItems: { $avg: '$itemCount' } } }
        ])
      ])

      const statusMap = {}
      byStatus.forEach(s => {
        statusMap[s._id] = s.count
      })

      return {
        total,
        byStatus: statusMap,
        avgItemsPerOrder: avgItems[0]?.avgItems || 0
      }
    } catch (error) {
      console.error('Order metrics error:', error)
      return { total: 0, byStatus: {}, avgItemsPerOrder: 0 }
    }
  }

  // Customer metrics
  async getCustomerMetrics(dateFilter) {
    try {
      const [total, newCustomers, returning, loyaltyStats] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'user', ...dateFilter }),
        Order.aggregate([
          { $match: dateFilter },
          { $group: { _id: '$user', orderCount: { $sum: 1 } } },
          { $match: { orderCount: { $gt: 1 } } },
          { $count: 'returningCustomers' }
        ]),
        LoyaltyProgram.aggregate([
          {
            $group: {
              _id: null,
              avgLifetimePoints: { $avg: '$points.lifetime' },
              totalActivePrograms: { $sum: { $cond: ['$isActive', 1, 0] } }
            }
          }
        ])
      ])

      return {
        total,
        new: newCustomers,
        returning: returning[0]?.returningCustomers || 0,
        loyaltyEngagement: loyaltyStats[0]?.totalActivePrograms || 0,
        avgLifetimePoints: loyaltyStats[0]?.avgLifetimePoints || 0
      }
    } catch (error) {
      console.error('Customer metrics error:', error)
      return { total: 0, new: 0, returning: 0 }
    }
  }

  // Product metrics
  async getProductMetrics() {
    try {
      const [total, lowStock, outOfStock, avgRating] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ stock: { $lt: 10, $gt: 0 } }),
        Product.countDocuments({ stock: 0 }),
        Product.aggregate([
          { $group: { _id: null, avgRating: { $avg: '$averageRating' } } }
        ])
      ])

      return {
        total,
        lowStock,
        outOfStock,
        avgRating: avgRating[0]?.avgRating || 0
      }
    } catch (error) {
      console.error('Product metrics error:', error)
      return { total: 0, lowStock: 0, outOfStock: 0, avgRating: 0 }
    }
  }

  // Top products
  async getTopProducts(dateFilter, limit = 10) {
    try {
      const topProducts = await Order.aggregate([
        { $match: dateFilter },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            name: '$product.name',
            image: { $arrayElemAt: ['$product.images', 0] },
            totalSold: 1,
            revenue: 1
          }
        }
      ])

      return topProducts
    } catch (error) {
      console.error('Top products error:', error)
      return []
    }
  }

  // Category performance
  async getCategoryPerformance(dateFilter) {
    try {
      const performance = await Order.aggregate([
        { $match: dateFilter },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            itemsSold: { $sum: '$items.quantity' }
          }
        },
        { $sort: { revenue: -1 } }
      ])

      return performance
    } catch (error) {
      console.error('Category performance error:', error)
      return []
    }
  }

  // Revenue by day
  async getRevenueByDay(dateFilter) {
    try {
      const revenueByDay = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])

      return revenueByDay.map(day => ({
        date: new Date(day._id.year, day._id.month - 1, day._id.day),
        revenue: day.revenue,
        orders: day.orders
      }))
    } catch (error) {
      console.error('Revenue by day error:', error)
      return []
    }
  }

  // Conversion funnel
  async getConversionFunnel(dateFilter) {
    try {
      const [visitors, addedToCart, checkouts, purchases] = await Promise.all([
        CustomerJourney.countDocuments({
          startedAt: dateFilter.createdAt
        }),
        CustomerJourney.countDocuments({
          startedAt: dateFilter.createdAt,
          'touchpoints.type': 'add_to_cart'
        }),
        CustomerJourney.countDocuments({
          startedAt: dateFilter.createdAt,
          'touchpoints.type': 'checkout_start'
        }),
        CustomerJourney.countDocuments({
          startedAt: dateFilter.createdAt,
          converted: true
        })
      ])

      return {
        visitors,
        addedToCart,
        checkouts,
        purchases,
        rates: {
          cartConversion: visitors > 0 ? (addedToCart / visitors) * 100 : 0,
          checkoutConversion: addedToCart > 0 ? (checkouts / addedToCart) * 100 : 0,
          purchaseConversion: checkouts > 0 ? (purchases / checkouts) * 100 : 0,
          overall: visitors > 0 ? (purchases / visitors) * 100 : 0
        }
      }
    } catch (error) {
      console.error('Conversion funnel error:', error)
      return { visitors: 0, addedToCart: 0, checkouts: 0, purchases: 0, rates: {} }
    }
  }

  // Customer lifetime value
  async getCustomerLifetimeValue(dateFilter) {
    try {
      const clv = await Order.aggregate([
        { $match: { status: { $in: ['delivered'] } } },
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            firstOrder: { $min: '$createdAt' },
            lastOrder: { $max: '$createdAt' }
          }
        },
        {
          $group: {
            _id: null,
            avgLifetimeValue: { $avg: '$totalSpent' },
            avgOrderCount: { $avg: '$orderCount' },
            avgOrderValue: { $avg: { $divide: ['$totalSpent', '$orderCount'] } }
          }
        }
      ])

      return clv[0] || { avgLifetimeValue: 0, avgOrderCount: 0, avgOrderValue: 0 }
    } catch (error) {
      console.error('CLV error:', error)
      return { avgLifetimeValue: 0, avgOrderCount: 0, avgOrderValue: 0 }
    }
  }

  // Bundle performance
  async getBundlePerformance(dateFilter) {
    try {
      const bundles = await Bundle.find()

      const performance = bundles.map(bundle => ({
        name: bundle.name,
        views: bundle.stats.views,
        sales: bundle.stats.sales,
        revenue: bundle.stats.revenue,
        conversionRate: bundle.stats.views > 0
          ? (bundle.stats.sales / bundle.stats.views) * 100
          : 0
      }))

      return performance.sort((a, b) => b.revenue - a.revenue).slice(0, 10)
    } catch (error) {
      console.error('Bundle performance error:', error)
      return []
    }
  }

  // Helper methods
  getDateFilter(startDate, endDate) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    return {
      createdAt: { $gte: start, $lte: end }
    }
  }

  getDaysDifference(start, end) {
    return Math.floor((end - start) / (1000 * 60 * 60 * 24))
  }
}

module.exports = new AnalyticsAggregationService()