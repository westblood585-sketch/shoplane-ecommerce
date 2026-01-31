import { useState, useEffect } from 'react'
import { Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { productAPI } from '../../api/productAPI'
import useCartStore from '../../store/cartStore'
import { allProducts } from '../../data/mockProducts'

const FrequentlyBoughtTogether = ({ currentProduct }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([currentProduct._id])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        const data = await productAPI.getFrequentlyBoughtTogether(currentProduct._id)
        setSuggestedProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        // MOCK DATA - Backend hazır olana kadar
        const randomProducts = allProducts
          .filter(p => p.id !== currentProduct.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map(p => ({
            ...p,
            _id: p.id,
            images: [p.image]
          }))
        setSuggestedProducts(randomProducts)
      } finally {
        setLoading(false)
      }
    }

    if (currentProduct._id) {
      fetchSuggestions()
    }
  }, [currentProduct._id])

  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const calculateTotal = () => {
    const currentPrice = selectedProducts.includes(currentProduct._id) ? currentProduct.price : 0
    const suggestedPrice = suggestedProducts
      .filter(p => selectedProducts.includes(p._id))
      .reduce((sum, p) => sum + p.price, 0)
    return currentPrice + suggestedPrice
  }

  const handleAddAllToCart = () => {
    if (selectedProducts.includes(currentProduct._id)) {
      addItem(currentProduct)
    }
    suggestedProducts
      .filter(p => selectedProducts.includes(p._id))
      .forEach(product => addItem(product))
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-32 bg-gray-200 rounded w-32"></div>
          <div className="h-32 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (!suggestedProducts.length) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Sık Birlikte Alınanlar</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Products List */}
        <div className="flex-1 flex flex-wrap md:flex-nowrap gap-4 items-center">
          {/* Current Product */}
          <div className="relative">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.includes(currentProduct._id)}
                onChange={() => toggleProduct(currentProduct._id)}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <img
                  src={currentProduct.images[0]}
                  alt={currentProduct.name}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-medium line-clamp-2">{currentProduct.name}</p>
                <p className="text-lg font-bold text-blue-600">₺{currentProduct.price.toFixed(2)}</p>
              </div>
            </label>
          </div>

          {/* Plus Icon */}
          <Plus className="text-gray-400 hidden md:block flex-shrink-0" size={24} />

          {/* Suggested Products */}
          {suggestedProducts.map((product, index) => (
            <div key={product._id} className="relative flex items-center gap-2">
              {index > 0 && <Plus className="text-gray-400 hidden md:block flex-shrink-0" size={24} />}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => toggleProduct(product._id)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                  <p className="text-lg font-bold text-blue-600">₺{product.price.toFixed(2)}</p>
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* Summary & Action */}
        <div className="md:min-w-[250px] bg-gray-50 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Toplam Fiyat ({selectedProducts.length} ürün)
            </p>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              ₺{calculateTotal().toFixed(2)}
            </p>
            <p className="text-sm text-green-600 mb-6">
              ✓ Birlikte alarak tasarruf edin!
            </p>
          </div>

          <button
            onClick={handleAddAllToCart}
            disabled={selectedProducts.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Seçilenleri Sepete Ekle
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FrequentlyBoughtTogether
