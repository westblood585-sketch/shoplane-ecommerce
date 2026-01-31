import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import useComparisonStore from '../../store/comparisonStore'
import useCartStore from '../../store/cartStore'
import useFavoriteStore from '../../store/favoriteStore'

function ProductComparison({ products = [] }) {
  const { items, isInComparison } = useComparisonStore()
  const { addToCart } = useCartStore()
  const { addToFavorite, isFavorite } = useFavoriteStore()
  const [selectedProducts] = useState(items.length > 0 ? items : products)

  const comparisonAttributes = [
    { label: 'Fiyat', key: 'price', type: 'price' },
    { label: 'Eski Fiyat', key: 'oldPrice', type: 'price' },
    { label: 'İndirim', key: 'discount', type: 'discount' },
    { label: 'Kategori', key: 'category', type: 'text' },
    { label: 'Marka', key: 'brand', type: 'text' },
    { label: 'Stok', key: 'stock', type: 'number' },
    { label: 'Rating', key: 'rating', type: 'rating' },
    { label: 'Yorumlar', key: 'numReviews', type: 'number' },
    { label: 'Renkler', key: 'colors', type: 'array' },
    { label: 'Boyutlar', key: 'sizes', type: 'array' }
  ]

  const calculateDiscount = (price, oldPrice) => {
    if (!oldPrice) return 0
    return Math.round(((oldPrice - price) / oldPrice) * 100)
  }

  const renderValue = (product, attribute) => {
    const value = product[attribute.key]

    switch (attribute.type) {
      case 'price':
        return value ? `₺${value.toFixed(2)}` : '-'
      case 'rating':
        return value ? `⭐ ${value.toFixed(1)} / 5` : '-'
      case 'number':
        return value || '-'
      case 'discount':
        const discount = calculateDiscount(product.price, product.oldPrice)
        return discount > 0 ? `-%${discount}` : '-'
      case 'array':
        return Array.isArray(value) && value.length > 0 ? value.join(', ') : '-'
      default:
        return value || '-'
    }
  }

  if (selectedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Karşılaştırma yapmak için ürünler seçin
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b dark:border-dark-border">
        <h2 className="text-2xl font-bold dark:text-dark-text">
          Ürün Karşılaştırması
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {selectedProducts.length} ürün seçildi
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* Product Images and Names */}
            <tr className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition">
              <td className="py-4 px-4 font-bold dark:text-dark-text min-w-[150px] bg-gray-50 dark:bg-dark-hover">
                Ürün
              </td>
              {selectedProducts.map((product) => (
                <td key={product._id} className="py-4 px-4 text-center min-w-[200px]">
                  <div>
                    <img
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <p className="font-semibold text-sm line-clamp-2 dark:text-dark-text">
                      {product.name}
                    </p>
                  </div>
                </td>
              ))}
            </tr>

            {/* Comparison Attributes */}
            {comparisonAttributes.map((attribute) => (
              <tr key={attribute.key} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition">
                <td className="py-4 px-4 font-semibold dark:text-dark-text min-w-[150px] bg-gray-50 dark:bg-dark-hover">
                  {attribute.label}
                </td>
                {selectedProducts.map((product) => (
                  <td key={product._id} className="py-4 px-4 text-center dark:text-dark-text min-w-[200px]">
                    {renderValue(product, attribute)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Add to Cart Row */}
            <tr className="border-b dark:border-dark-border">
              <td className="py-4 px-4 bg-gray-50 dark:bg-dark-hover"></td>
              {selectedProducts.map((product) => (
                <td key={product._id} className="py-4 px-4 min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                      })}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Sepete Ekle
                    </button>
                    <button
                      onClick={() => addToFavorite(product)}
                      className="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Heart size={16} className={isFavorite(product._id) ? 'fill-current' : ''} />
                      Favoriler
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductComparison
