// @desc    Get email preferences
// @route   GET /api/users/email-preferences
// @access  Private
exports.getEmailPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('emailSubscribed notifications')

    res.status(200).json({
      success: true,
      preferences: {
        emailSubscribed: user.emailSubscribed,
        notifications: user.notifications
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update email preferences
// @route   PUT /api/users/email-preferences
// @access  Private
exports.updateEmailPreferences = async (req, res, next) => {
  try {
    const { emailSubscribed, notifications } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        emailSubscribed,
        notifications
      },
      { new: true, runValidators: true }
    ).select('emailSubscribed notifications')

    res.status(200).json({
      success: true,
      preferences: {
        emailSubscribed: user.emailSubscribed,
        notifications: user.notifications
      }
    })
  } catch (error) {
    next(error)
  }
}