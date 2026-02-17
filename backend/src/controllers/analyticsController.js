const { v4: uuidv4 } = require('uuid')
const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const analyticsService = require('../services/analyticsService')

// @desc    Dashboard istatistikleri
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    // Toplam siparişler
    const totalOrders = await Order.countDocuments(dateFilter)
    const pendingOrders = await Order.countDocuments({ ...dateFilter, status: 'pending' })
    const completedOrders = await Order.countDocuments({ ...dateFilter, status: 'delivered' })

    // Toplam gelir
    const revenueData = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
          average: { $avg: '$totalPrice' }
        }
      }
    ])

    const revenue = revenueData[0] || { total: 0, average: 0 }

    // Toplam kullanıcılar
    const totalUsers = await User.countDocuments(dateFilter)
    const newUsers = await User.countDocuments({
      ...dateFilter,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    })

    // Toplam ürünler
    const totalProducts = await Product.countDocuments({ isActive: true })
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } })

    // En çok satan ürünler
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
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ])

    // Kategori bazlı satışlar
    const salesByCategory = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          totalSales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ])

    // Günlük satış trendi (son 30 gün)
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.status(200).json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        revenue: {
          total: revenue.total,
          average: revenue.average
        },
        users: {
          total: totalUsers,
          new: newUsers
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        }
      },
      topProducts,
      salesByCategory,
      salesTrend
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Satış raporu
// @route   GET /api/analytics/sales-report
// @access  Private/Admin
exports.getSalesReport = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query

    let groupBy
    let dateRange

    switch (period) {
      case 'week':
        dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        break
      case 'month':
        dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        break
      case 'year':
        dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
        break
      default:
        dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
    }

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: dateRange } } },
      {
        $group: {
          _id: groupBy,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.status(200).json({
      success: true,
      period,
      data: salesData
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Track heatmap data
// @route   POST /api/analytics/heatmap
// @access  Public
exports.trackHeatmap = async (req, res, next) => {
  try {
    const {
      page,
      url,
      type,
      x,
      y,
      value,
      element,
      viewport,
      sessionId
    } = req.body

    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    const sessionInfo = {
      sessionId,
      user: userId,
      anonymousId,
      timestamp: Date.now()
    }

    await analyticsService.trackHeatmapData(
      page,
      url,
      type,
      x,
      y,
      value,
      element,
      viewport,
      sessionInfo
    )

    res.status(200).json({
      success: true,
      message: 'Heatmap data tracked'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get heatmap data
// @route   GET /api/analytics/heatmap/:page/:type
// @access  Private/Admin
exports.getHeatmap = async (req, res, next) => {
  try {
    const { page, type } = req.params
    const { startDate, endDate } = req.query

    const heatmap = await analyticsService.getHeatmapData(
      page,
      type,
      startDate,
      endDate
    )

    res.status(200).json({
      success: true,
      heatmap
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Start session recording
// @route   POST /api/analytics/session/start
// @access  Public
exports.startSession = async (req, res, next) => {
  try {
    let { sessionId, deviceInfo } = req.body

    // Generate sessionId if not provided
    if (!sessionId) {
      sessionId = uuidv4()
    }

    const userId = req.user?.id
    const anonymousId = req.cookies.anonymousId || req.headers['x-anonymous-id']

    const recording = await analyticsService.createSession(
      sessionId,
      userId,
      anonymousId,
      deviceInfo
    )

    if (!recording) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create session'
      })
    }

    res.status(200).json({
      success: true,
      sessionId: recording.sessionId
    })
  } catch (error) {
    console.error('Start session error:', error.message)
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Track session event
// @route   POST /api/analytics/session/event
// @access  Public
exports.trackSessionEvent = async (req, res, next) => {
  try {
    const { sessionId, event } = req.body

    await analyticsService.addSessionEvent(sessionId, event)

    res.status(200).json({
      success: true,
      message: 'Event tracked'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    End session
// @route   POST /api/analytics/session/end
// @access  Public
exports.endSession = async (req, res, next) => {
  try {
    const { sessionId, converted, conversionValue } = req.body

    await analyticsService.endSession(sessionId, converted, conversionValue)

    res.status(200).json({
      success: true,
      message: 'Session ended'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get session replay
// @route   GET /api/analytics/session/:sessionId
// @access  Private/Admin
exports.getSessionReplay = async (req, res, next) => {
  try {
    const { sessionId } = req.params

    const replay = await analyticsService.getSessionReplay(sessionId)

    if (!replay) {
      return res.status(404).json({
        success: false,
        message: 'Session bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      replay
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get sessions list
// @route   GET /api/analytics/sessions
// @access  Private/Admin
exports.getSessions = async (req, res, next) => {
  try {
    const filters = req.query

    const result = await analyticsService.getSessions(filters)

    res.status(200).json({
      success: true,
      ...result
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get insights
// @route   GET /api/analytics/insights/:page
// @access  Private/Admin
exports.getInsights = async (req, res, next) => {
  try {
    const { page } = req.params

    const insights = await analyticsService.generateInsights(page)

    res.status(200).json({
      success: true,
      insights
    })
  } catch (error) {
    next(error)
  }
}