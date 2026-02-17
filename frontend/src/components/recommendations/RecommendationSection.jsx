import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function RecommendationSection({ title, products, icon: Icon, loading = false }) {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="mb-12">
        <div className="h-8 w-64 bg-gray-200 dark:bg-dark-hover rounded mb-6 animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[250px] h-[400px] bg-gray-200 dark:bg-dark-hover rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) return null

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon size={20} className="text-white" />
            </div>
          )}
          <h2 className="text-2xl font-bold dark:text-dark-text">{title}</h2>
        </div>

        {/* Scroll Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition"
          >
            <ChevronLeft size={20} className="mx-auto" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition"
          >
            <ChevronRight size={20} className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Products Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((item, index) => {
          const product = item.product || item

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/products/${product.slug || product._id}`)}
              className="min-w-[250px] bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden cursor-pointer group hover:shadow-2xl transition"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Score Badge */}
                {item.score && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-xs font-bold">
                    {item.score}% Match
                  </div>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                    %{product.discount} İndirim
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {product.brand}
                </p>

                {/* Name */}
                <h3 className="font-bold mb-2 line-clamp-2 dark:text-dark-text">
                  {product.name}
                </h3>

                {/* Reason */}
                {item.reason && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1">
                    <Sparkles size={12} />
                    {item.reason}
                  </p>
                )}

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-lg font-bold text-red-600">
                        {(product.price * (1 - product.discount / 100)).toFixed(2)}₺
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.price}₺
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-blue-600">
                      {product.price}₺
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    Son {product.stock} ürün!
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default RecommendationSection