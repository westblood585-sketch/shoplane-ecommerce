const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getFrequentlyBoughtTogether
} = require('../controllers/productController')
const { visualSearch, visualSearchByUrl } = require('../controllers/visualSearchController')
const upload = require('../middleware/upload')
const { protect, admin } = require('../middleware/auth')

// Public routes
router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/categories', getCategories)
router.get('/brands', getBrands)

// Visual Search Routes - YENİ
router.post('/visual-search', upload.single('image'), visualSearch)
router.post('/visual-search-url', visualSearchByUrl)

router.get('/:id/frequently-bought-together', getFrequentlyBoughtTogether)
router.get('/:id', getProduct)

// Admin routes
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

module.exports = router