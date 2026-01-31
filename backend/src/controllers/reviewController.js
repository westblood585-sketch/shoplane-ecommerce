const Review = require('../models/Review')
const Product = require('../models/Product')

// @desc    Ürün yorumlarını getir
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Yorum ekle
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const productId = req.params.productId

    // Ürün var mı kontrol et
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    // Kullanıcı daha önce yorum yapmış mı?
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bu ürün için zaten yorum yaptınız'
      })
    }

    // Yorum oluştur
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment
    })

    // Ürün ortalam puanını güncelle
    const reviews = await Review.find({ product: productId })
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    product.rating = avgRating
    product.numReviews = reviews.length
    await product.save()

    await review.populate('user', 'name avatar')

    res.status(201).json({
      success: true,
      review
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Yorum güncelle
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      })
    }

    // Kullanıcı kontrolü
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu güncelleme yetkiniz yok'
      })
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name avatar')

    // Ürün ortalam puanını güncelle
    const reviews = await Review.find({ product: review.product })
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      numReviews: reviews.length
    })

    res.status(200).json({
      success: true,
      review
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Yorum sil
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      })
    }

    // Kullanıcı kontrolü veya admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu silme yetkiniz yok'
      })
    }

    const productId = review.product
    await review.deleteOne()

    // Ürün ortalam puanını güncelle
    const reviews = await Review.find({ product: productId })
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length
    })

    res.status(200).json({
      success: true,
      message: 'Yorum silindi'
    })
  } catch (error) {
    next(error)
  }
}