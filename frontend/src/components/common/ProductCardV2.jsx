import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingCart, Star, Zap, Scale } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useFavoriteStore from '../../store/favoriteStore'
import useAuthStore from '../../store/authStore'
import useComparisonStore from '../../store/comparisonStore'
import QuickViewModal from './QuickViewModal'

function ProductCardV2({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const { addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { isAuthenticated } = useAuthStore()
  const { addToComparison, isInComparison } = useComparisonStore()
  
  const favorite = isFavorite(product._id)
  const inComparison = isInComparison(product._id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product, 'M', product.colors?.[0] || 'Standart', 1)
    // Toast notification eklenecek
  }

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    toggleFavorite(product._id)
  }

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border dark:border-dark-border"
      >
        <Link to={`/products/${product._id}`}>
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Skeleton Loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
            )}

            {/* Product Image */}
            <motion.img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNew && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg"
                >
                  YENİ
                </motion.span>
              )}
              {discountPercentage > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg"
                >
                  -{discountPercentage}%
                </motion.span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
                >
                  <Zap size={12} />
                  Son {product.stock} Adet
                </motion.span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                  favorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart
                  size={20}
                  fill={favorite ? 'currentColor' : 'none'}
                  className="transition-all"
                />
              </motion.button>

              {/* QUICK VIEW BUTTON */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  setShowQuickView(true)
                }}
                className="p-3 bg-white/90 dark:bg-gray-700/90 rounded-full backdrop-blur-md hover:bg-blue-500 hover:text-white transition-all shadow-lg text-gray-700 dark:text-gray-200"
              >
                <Eye size={20} />
              </motion.button>

              {/* COMPARISON BUTTON */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  addToComparison(product)
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                  inComparison
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 hover:bg-purple-500 hover:text-white'
                }`}
                title="Karşılaştır"
              >
                <Scale size={20} />
              </motion.button>
            </div>

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            />

            {/* Quick Add to Cart Button */}
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 100,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="absolute bottom-4 left-4 right-4 py-3 bg-white dark:bg-dark-card text-black dark:text-dark-text rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl z-20"
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Product Name */}
            <h3 className="font-bold text-gray-900 dark:text-dark-text mb-2 line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                    className="text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                ({product.numReviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                  ₺{product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ₺{product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Free Shipping Badge */}
              {product.price > 500 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Ücretsiz Kargo
                </span>
              )}
            </div>

            {/* Color Options Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-3">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

export default ProductCardV2