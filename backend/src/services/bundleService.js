const Bundle = require('../models/Bundle')
const Product = require('../models/Product')

class BundleService {
  async createBundle(bundleData) {
    try {
      const slug = bundleData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      const bundle = await Bundle.create({
        ...bundleData,
        slug
      })
      await bundle.calculatePricing()
      return bundle
    } catch (error) {
      console.error('Create bundle error:', error)
      throw error
    }
  }
  async getRecommendedBundles(productId, limit = 5) {
    try {
      const bundles = await Bundle.find({
        'products.product': productId,
        isActive: true
      })
      .populate('products.product', 'name images price')
      .limit(limit)
      .sort({ 'pricing.savings': -1 })
      return bundles.filter(b => b.isValid)
    } catch (error) {
      console.error('Get recommendations error:', error)
      return []
    }
  }
  async getPopularBundles(limit = 10) {
    try {
      const bundles = await Bundle.find({
        isActive: true
      })
      .populate('products.product', 'name images price')
      .sort({ 'stats.sales': -1 })
      .limit(limit)
      return bundles.filter(b => b.isValid)
    } catch (error) {
      console.error('Get popular bundles error:', error)
      return []
    }
  }
  async validateBundle(bundleId, selectedProducts = null) {
    try {
      const bundle = await Bundle.findById(bundleId)
        .populate('products.product')
      if (!bundle) {
        return { valid: false, message: 'Bundle bulunamadı' }
      }
      if (!bundle.isActive) {
        return { valid: false, message: 'Bundle aktif değil' }
      }
      if (!bundle.isValid) {
        return { valid: false, message: 'Bundle süresi dolmuş' }
      }
      const hasStock = await bundle.checkStock()
      if (!hasStock) {
        return { valid: false, message: 'Bazı ürünler stokta yok' }
      }
      if (bundle.type === 'mix_and_match') {
        if (!selectedProducts) {
          return { valid: false, message: 'Ürün seçimi gerekli' }
        }
        if (selectedProducts.length < bundle.mixAndMatch.minItems) {
          return { 
            valid: false, 
            message: `En az ${bundle.mixAndMatch.minItems} ürün seçmelisiniz` 
          }
        }
        if (selectedProducts.length > bundle.mixAndMatch.maxItems) {
          return { 
            valid: false, 
            message: `En fazla ${bundle.mixAndMatch.maxItems} ürün seçebilirsiniz` 
          }
        }
      }
      return { valid: true, bundle }
    } catch (error) {
      console.error('Validate bundle error:', error)
      return { valid: false, message: 'Validation hatası' }
    }
  }
  calculateCustomBundlePrice(bundle, selectedProducts) {
    try {
      let totalPrice = 0
      selectedProducts.forEach(productId => {
        const bundleProduct = bundle.products.find(
          p => p.product._id.toString() === productId.toString() ||
               p.alternatives.some(a => a.toString() === productId.toString())
        )
        if (bundleProduct) {
          const product = bundleProduct.product._id.toString() === productId.toString()
            ? bundleProduct.product
            : Product.findById(productId)
          totalPrice += product.price * bundleProduct.quantity
        }
      })
      let finalPrice = totalPrice
      switch (bundle.pricing.type) {
        case 'percentage_discount':
          finalPrice = totalPrice * (1 - bundle.pricing.discountPercentage / 100)
          break
        case 'amount_discount':
          finalPrice = totalPrice - bundle.pricing.discountAmount
          break
      }
      return {
        originalPrice: totalPrice,
        finalPrice: Math.max(finalPrice, 0),
        savings: totalPrice - finalPrice
      }
    } catch (error) {
      console.error('Calculate custom price error:', error)
      return null
    }
  }
  async getBundleAnalytics(bundleId) {
    try {
      const bundle = await Bundle.findById(bundleId)
      if (!bundle) return null
      const conversionRate = bundle.stats.views > 0
        ? (bundle.stats.sales / bundle.stats.views) * 100
        : 0
      const avgOrderValue = bundle.stats.sales > 0
        ? bundle.stats.revenue / bundle.stats.sales
        : 0
      return {
        totalViews: bundle.stats.views,
        totalSales: bundle.stats.sales,
        totalRevenue: bundle.stats.revenue,
        conversionRate,
        avgOrderValue,
        savingsPerBundle: bundle.pricing.savings
      }
    } catch (error) {
      console.error('Get analytics error:', error)
      return null
    }
  }
}

module.exports = new BundleService()
