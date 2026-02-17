const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
    createSubscription,
    getMySubscriptions,
    getSubscription,
    updateSubscriptionStatus
} = require('../controllers/subscriptionController')

router.use(protect)

router.route('/')
    .post(createSubscription)
    .get(getMySubscriptions)

router.route('/:id')
    .get(getSubscription)

router.route('/:id/status')
    .put(updateSubscriptionStatus)

module.exports = router