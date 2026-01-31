import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import useComparisonStore from '../../store/comparisonStore'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'

function ComparisonFloatingButton() {
  const { items, removeFromComparison, clearComparison } = useComparisonStore()
  const { addToCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  if (items.length === 0) return null

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    alert('Ürün sepete eklendi!')
  }

  const comparisonData = [
    { label: 'Fiyat', key: 'price' },
    { label: 'Kategori', key: 'category' },
    { label: 'Marka', key: 'brand' },
    { label: 'Stok', key: 'stock' },
    { label: 'Rating', key: 'rating' },
    { label: 'Yorumlar', key: 'numReviews' }
  ]

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg hover:shadow-xl transition z-40"
      >
        {items.length}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b dark:border-dark-border sticky top-0 bg-white dark:bg-dark-card">
                  <h2 className="text-2xl font-bold dark:text-dark-text">
                    Ürün Karşılaştırması ({items.length})
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto p-6">
                  <table className="w-full">
                    <tbody>
                      {/* Products Row */}
                      <tr className="border-b dark:border-dark-border">
                        <td className="py-4 px-4 font-bold dark:text-dark-text min-w-[150px]">
                          Ürün
                        </td>
                        {items.map((product) => (
                          <td key={product._id} className="py-4 px-4 min-w-[200px]">
                            <div className="text-center">
                              <img
                                src={product.image || 'https://via.placeholder.com/150'}
                                alt={product.name}
                                className="w-32 h-32 object-cover rounded-lg mb-2 mx-auto cursor-pointer hover:scale-110 transition"
                                onClick={() => {
                                  navigate(`/product/${product._id}`)
                                  setIsOpen(false)
                                }}
                              />
                              <p className="font-semibold text-sm line-clamp-2 dark:text-dark-text mb-3">
                                {product.name}
                              </p>
                              <button
                                onClick={() => removeFromComparison(product._id)}
                                className="text-red-600 text-sm hover:underline"
                              >
                                Kaldır
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Comparison Data */}
                      {comparisonData.map((data) => (
                        <tr key={data.key} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition">
                          <td className="py-4 px-4 font-semibold dark:text-dark-text min-w-[150px]">
                            {data.label}
                          </td>
                          {items.map((product) => (
                            <td key={product._id} className="py-4 px-4 text-center dark:text-dark-text min-w-[200px]">
                              {data.key === 'price' && `₺${product[data.key]?.toFixed(2)}`}
                              {data.key === 'rating' && `⭐ ${product[data.key]?.toFixed(1)}`}
                              {data.key === 'numReviews' && `${product[data.key]} yorum`}
                              {!['price', 'rating', 'numReviews'].includes(data.key) && (product[data.key] || '-')}
                            </td>
                          ))}
                        </tr>
                      ))}

                      {/* Add to Cart */}
                      <tr className="border-b dark:border-dark-border">
                        <td className="py-4 px-4"></td>
                        {items.map((product) => (
                          <td key={product._id} className="py-4 px-4 text-center min-w-[200px]">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                            >
                              <ShoppingCart size={18} />
                              Sepete Ekle
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 border-t dark:border-dark-border sticky bottom-0 bg-white dark:bg-dark-card">
                  <button
                    onClick={() => clearComparison()}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-dark-border rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition dark:text-dark-text"
                  >
                    Tümünü Temizle
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ComparisonFloatingButton
