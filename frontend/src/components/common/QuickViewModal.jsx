import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingCart, Heart, Star, Share2, Truck, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useFavoriteStore from '../../store/favoriteStore'
import useAuthStore from '../../store/authStore'

function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { isAuthenticated } = useAuthStore()

  if (!product) return null

  const favorite = isFavorite(product._id)

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity)
    // TODO: Toast notification ekle
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    toggleFavorite(product._id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <div className="grid md:grid-cols-2 gap-0 h-full max-h-[90vh] overflow-y-auto">
                {/* Left Side - Images */}
                <div className="bg-gray-50 p-6 md:p-8">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                  >
                    <X size={24} />
                  </button>

                  {/* Main Image */}
                  <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 group">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          YENİ
                        </span>
                      )}
                      {product.oldPrice && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-3 rounded-full backdrop-blur-md shadow-lg transition ${
                          favorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
                      </button>
                      <button className="p-3 bg-white/90 rounded-full backdrop-blur-md hover:bg-blue-500 hover:text-white transition shadow-lg">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="p-6 md:p-8 flex flex-col">
                  {/* Brand */}
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {product.brand}
                  </p>

                  {/* Product Name */}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                          className="text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.numReviews} değerlendirme)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ₺{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ₺{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <p className="font-semibold mb-3">Renk: <span className="font-normal">{selectedColor}</span></p>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border-2 transition ${
                              selectedColor === color
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <p className="font-semibold mb-3">Beden: <span className="font-normal">{selectedSize}</span></p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 transition ${
                              selectedSize === size
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="font-semibold mb-3">Adet</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                        disabled={quantity <= 1}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition"
                        disabled={quantity >= product.stock}
                      >
                        <Plus size={20} />
                      </button>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.stock} adet stokta)
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    <ShoppingCart size={24} />
                    {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                  </button>

                  {/* View Full Details */}
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full py-3 border-2 border-gray-300 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
                  >
                    Tüm Detayları Gör
                  </Link>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="text-green-600" size={20} />
                      <span className="text-gray-600">Ücretsiz Kargo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="text-blue-600" size={20} />
                      <span className="text-gray-600">Güvenli Ödeme</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickViewModal