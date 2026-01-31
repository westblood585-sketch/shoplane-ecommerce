const express = require('express')
const router = express.Router()
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} = require('../controllers/favoriteController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', getFavorites)
router.get('/check/:productId', checkFavorite)
router.post('/:productId', addToFavorites)
router.delete('/:productId', removeFromFavorites)

module.exports = router