const Product = require('../models/Product')
const sharp = require('sharp')

// @desc    Visual Search (Image-based product search)
// @route   POST /api/products/visual-search
// @access  Public
exports.visualSearch = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir resim yükleyin'
      })
    }

    // Image processing (resize, optimize)
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer()

    // Gerçek AI/ML entegrasyonu için:
    // - Google Cloud Vision API
    // - AWS Rekognition
    // - TensorFlow.js
    // - Custom ML model
    
    // Şimdilik basit bir algoritma kullanalım:
    // Tüm ürünleri getir ve rastgele sırala (demo için)
    
    const allProducts = await Product.find({ isActive: true })
      .select('name price oldPrice images brand rating numReviews stock category')
      .limit(20)
    
    // Rastgele sırala (gerçek uygulamada similarity score'a göre sırala)
    const shuffled = allProducts.sort(() => 0.5 - Math.random())
    const similarProducts = shuffled.slice(0, 12)

    res.status(200).json({
      success: true,
      message: 'Benzer ürünler bulundu',
      products: similarProducts,
      total: similarProducts.length
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Visual Search with URL
// @route   POST /api/products/visual-search-url
// @access  Public
exports.visualSearchByUrl = async (req, res, next) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL gerekli'
      })
    }

    // URL'den resim indir ve işle
    // Şimdilik basit response dönelim
    
    const products = await Product.find({ isActive: true })
      .select('name price oldPrice images brand rating numReviews stock')
      .limit(12)

    res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    next(error)
  }
}