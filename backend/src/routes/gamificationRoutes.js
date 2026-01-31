const express = require('express')
const router = express.Router()
const gamificationController = require('../controllers/gamificationController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/profile', gamificationController.getGamificationProfile)
router.post('/spin', gamificationController.spinWheel)
router.get('/badges', gamificationController.getAllBadges)
router.get('/leaderboard', gamificationController.getLeaderboard)

module.exports = router