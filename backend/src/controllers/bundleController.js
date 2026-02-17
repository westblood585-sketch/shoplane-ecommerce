const Bundle = require('../models/Bundle')
const Product = require('../models/Product')

const bundleController = {
  getBundles: async (req, res, next) => {
    try {
      const { active = 'true' } = req.query;
      const filter = {};
      if (active === 'true') {
        filter.isActive = true;
        filter.endDate = { $gte: new Date() };
        filter.stock = { $gt: 0 };
      }
      const bundles = await Bundle.find(filter)
        .populate('products.product', 'name price images brand stock')
        .sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        count: bundles.length,
        bundles,
      });
    } catch (error) {
      if (error.message.includes('authentication') || error.message.includes('auth')) {
        console.log('⚠️ MongoDB Auth Error (Bundles) - Returning sample data');
        return res.status(200).json({
          success: true,
          count: 0,
          bundles: []
        });
      }
      next(error);
    }
  },
  getBundleById: async (req, res, next) => {
    try {
      const bundle = await Bundle.findById(req.params.id).populate(
        'products.product',
        'name price oldPrice images brand rating numReviews stock description'
      );
      if (!bundle) {
        return res.status(404).json({
          success: false,
          message: 'Paket bulunamadı',
        });
      }
      res.status(200).json({
        success: true,
        bundle,
      });
    } catch (error) {
      next(error);
    }
  },
  createBundle: async (req, res, next) => {
    try {
      const {
        name,
        description,
        products,
        bundlePrice,
        discountPercent,
        image,
        endDate,
        stock,
      } = req.body;
      let originalPrice = 0;
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Ürün bulunamadı: ${item.product}`,
          });
        }
        originalPrice += product.price * item.quantity;
      }
      const bundle = await Bundle.create({
        name,
        description,
        products,
        originalPrice,
        bundlePrice,
        discountPercent,
        image,
        endDate,
        stock,
      });
      res.status(201).json({
        success: true,
        bundle,
      });
    } catch (error) {
      next(error);
    }
  },
  updateBundle: async (req, res, next) => {
    try {
      let bundle = await Bundle.findById(req.params.id);
      if (!bundle) {
        return res.status(404).json({
          success: false,
          message: 'Paket bulunamadı',
        });
      }
      bundle = await Bundle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        success: true,
        bundle,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteBundle: async (req, res, next) => {
    try {
      const bundle = await Bundle.findById(req.params.id);
      if (!bundle) {
        return res.status(404).json({
          success: false,
          message: 'Paket bulunamadı',
        });
      }
      await bundle.deleteOne();
      res.status(200).json({
        success: true,
        message: 'Paket silindi',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bundleController;