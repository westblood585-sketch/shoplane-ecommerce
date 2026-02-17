const { getEmailPreferences, updateEmailPreferences } = require('../controllers/userController')

router.get('/email-preferences', protect, getEmailPreferences)
router.put('/email-preferences', protect, updateEmailPreferences)