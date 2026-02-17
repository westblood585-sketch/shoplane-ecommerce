const User = require('../models/User')
const emailService = require('../utils/emailService')

// @desc    Send campaign email
// @route   POST /api/emails/campaign
// @access  Private/Admin
exports.sendCampaignEmail = async (req, res, next) => {
  try {
    const { campaign, userFilter = {} } = req.body

    const users = await User.find({
      emailSubscribed: true,
      ...userFilter
    }).select('name email')

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kampanya göndermek için kullanıcı bulunamadı'
      })
    }

    // Batch gönderimi
    const batchSize = 50
    let sentCount = 0

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      
      for (const user of batch) {
        try {
          await emailService.sendCampaignEmail(user, campaign)
          sentCount++
        } catch (error) {
          console.error(`Campaign email error for ${user.email}:`, error.message)
        }
      }
      
      // Batch'ler arasında bir saniye bekle
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    res.status(200).json({
      success: true,
      message: `Kampanya emaili ${sentCount} kullanıcıya gönderildi`,
      sentCount
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Send test email
// @route   POST /api/emails/test
// @access  Private
exports.sendTestEmail = async (req, res, next) => {
  try {
    const user = req.user

    await emailService.sendWelcomeEmail(user)

    res.status(200).json({
      success: true,
      message: 'Test email gönderildi'
    })
  } catch (error) {
    next(error)
  }
}