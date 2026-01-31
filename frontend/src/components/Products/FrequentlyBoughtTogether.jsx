import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Check } from 'lucide-react'
import { productAPI } from '../../api/productAPI'
import useCartStore from '../../store/cartStore'

function FrequentlyBoughtTogether({ currentProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState([currentProduct._id])
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getFrequentlyBoughtTogether(currentProduct._id)
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentProduct._id])

  if (loading || products.length === 0) {
    return null
  }

  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const calculateTotal = () => {
    let total = 0
    
    if (selectedProducts.includes(currentProduct._id)) {
      total += currentProduct.price
    }
    
    products.forEach(product => {
      if (selectedProducts.includes(product._id)) {
        total += product.price
      }
    })
    
    return total
  }

  const handleAddAllToCart = () => {
    // Ana ürünü ekle
    if (selectedProducts.includes(currentProduct._id)) {
      addItem(currentProduct, currentProduct.sizes?.[0] || '', currentProduct.colors?.[0] || '', 1)
    }
    
    // Seçili ürünleri ekle
    products.forEach(product => {
      if (selectedProducts.includes(product._id)) {
        addItem(product, product.sizes?.[0] || '', product.colors?.[0] || '', 1)
      }
    })
    
    // TODO: Toast notification
  }

  const allProducts = [currentProduct, ...products]

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Bu Ürünü Alanlar Bunları da Aldı</h2>
            <p className="text-gray-600">Birlikte al, daha çok kazan!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {allProducts.map((product, index) => {
            const isSelected = selectedProducts.includes(product._id)
            const isCurrentProduct = product._id === currentProduct._id

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <button
                  onClick={() => !isCurrentProduct && toggleProduct(product._id)}
                  disabled={isCurrentProduct}
                  className={`w-full h-full p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isCurrentProduct ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isSelected && <Check size={16} className="text-white" />}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="text-left">
                    {isCurrentProduct && (
                      <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded-full mb-2">
                        Bu Ürün
                      </span>
                    )}
                    <p className="font-semibold text-sm mb-1 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        ₺{product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₺{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Plus Icon between products */}
                {index < allProducts.length - 1 && (
                  <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                    <Plus size={20} className="text-gray-600" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Total and Add to Cart */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {selectedProducts.length} ürün seçildi
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                ₺{calculateTotal().toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">toplam</span>
            </div>
          </div>

          <button
            onClick={handleAddAllToCart}
            disabled={selectedProducts.length === 0}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={24} />
            Hepsini Sepete Ekle
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default FrequentlyBoughtTogether