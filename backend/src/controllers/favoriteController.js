const Favorite = require('../models/Favorite')
const Product = require('../models/Product')

// @desc    Favorileri getir
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Favorilere ekle
// @route   POST /api/favorites/:productId
// @access  Private
exports.addToFavorites = async (req, res, next) => {
  try {
    const productId = req.params.productId

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      product: productId
    })

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Bu ürün zaten favorilerinizde'
      })
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      product: productId
    })

    await favorite.populate('product')

    res.status(201).json({
      success: true,
      favorite
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Favorilerden çıkar
// @route   DELETE /api/favorites/:productId
// @access  Private
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId
    })

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Favorilerden kaldırıldı'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ürün favori mi kontrol et
// @route   GET /api/favorites/check/:productId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      product: req.params.productId
    })

    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    })
  } catch (error) {
    next(error)
  }
}