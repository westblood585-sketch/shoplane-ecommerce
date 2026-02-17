const analyticsAggregationService = require('../services/analyticsAggregationService')

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardOverview = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    const overview = await analyticsAggregationService.getDashboardOverview(
      startDate,
      endDate
    )

    res.status(200).json({
      success: true,
      data: overview
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get real-time stats
// @route   GET /api/analytics/realtime
// @access  Private/Admin
exports.getRealtimeStats = async (req, res, next) => {
  try {
    const Order = require('../models/Order')
    const CustomerJourney = require('../models/CustomerJourney')

    // Last 24 hours
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [ordersLast24h, activeJourneys, recentOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: last24h } }),
      CustomerJourney.countDocuments({
        status: 'active',
        lastActivityAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 min
      }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .select('orderNumber totalAmount status createdAt')
    ])

    res.status(200).json({
      success: true,
      data: {
        ordersLast24h,
        activeUsers: activeJourneys,
        recentOrders
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = exports