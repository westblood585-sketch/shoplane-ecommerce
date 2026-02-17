import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import ProductCardV2 from '../common/ProductCardV2'
import API from '../../api/axiosConfig'

/**
 * Related Products Component
 * 
 * Displays products from the same category as the current product
 * Helps with:
 * - Internal linking & page authority distribution
 * - Increasing session time & reducing bounce rate
 * - Keyword relevance for SEO
 * - User experience (encouraging browsing)
 */
export default function RelatedProducts({ currentProductId, category, productName, limit = 4 }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true)
        // Fetch products from same category, excluding current product
        const response = await API.get(`/products?category=${category}&limit=${limit + 1}`)
        
        const filtered = (response.data.products || []).filter(
          p => p._id !== currentProductId
        ).slice(0, limit)
        
        setRelatedProducts(filtered)
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchRelated()
    }
  }, [category, currentProductId, limit])

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Benzer Ürünler</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (!relatedProducts.length) {
    return null
  }

  return (
    <section className="py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Benzer Ürünler</h2>
        </div>
        <Link 
          to={`/products?category=${category}`}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCardV2 
            key={product._id}
            product={product}
            className="hover:shadow-xl transition-shadow"
          />
        ))}
      </div>

      {/* SEO: Hidden text with keyword reinforcement */}
      <div className="sr-only">
        Benzer ürünler {category} kategorisinde. {relatedProducts.map(p => p.name).join(', ')}
      </div>
    </section>
  )
}
