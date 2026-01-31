const Product = require('../models/Product')

// @desc    Tüm ürünleri getir
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      color,
      size,
      rating,
      sort,
      page = 1,
      limit = 12
    } = req.query

    // Query oluştur
    let query = { isActive: true }

    // Arama
    if (keyword) {
      query.$text = { $search: keyword }
    }

    // Filtreler
    if (category) {
      query.category = category
    }

    if (brand) {
      query.brand = brand
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (color) {
      query.colors = { $in: [color] }
    }

    if (size) {
      query.sizes = { $in: [size] }
    }

    if (rating) {
      query.rating = { $gte: Number(rating) }
    }

    // Sıralama
    let sortOptions = {}
    if (sort === 'price-asc') {
      sortOptions = { price: 1 }
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 }
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 }
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 }
    } else {
      sortOptions = { createdAt: -1 } // Default
    }

    // Pagination
    const skip = (page - 1) * limit
    const total = await Product.countDocuments(query)

    // Ürünleri getir
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Tek ürün getir
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Öne çıkan ürünleri getir
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(6)
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      products
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ürün oluştur (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ürün güncelle (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Ürün sil (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    await product.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Ürün silindi'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Kategorileri getir
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category')

    res.status(200).json({
      success: true,
      categories
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Markaları getir
// @route   GET /api/products/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand')

    res.status(200).json({
      success: true,
      brands
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sık birlikte alınan ürünler
// @route   GET /api/products/:id/frequently-bought-together
// @access  Public
exports.getFrequentlyBoughtTogether = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      })
    }

    // Aynı kategoriden rastgele 4 ürün getir (simüle edilmiş)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .select('name price oldPrice images brand rating numReviews stock')

    res.status(200).json({
      success: true,
      products: relatedProducts
    })
  } catch (error) {
    next(error)
  }
}