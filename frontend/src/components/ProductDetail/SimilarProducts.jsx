import { useState, useEffect } from 'react'
import ProductCard from '../common/ProductCard'
import { productAPI } from '../../api/productAPI'

function SimilarProducts({ currentProductId, category }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const data = await productAPI.getProducts({
          category,
          limit: 4
        })
        
        // Mevcut ürünü hariç tut
        const filtered = data.products.filter(p => p._id !== currentProductId)
        setProducts(filtered.slice(0, 4))
      } catch (error) {
        console.error('Similar products error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchSimilarProducts()
    }
  }, [currentProductId, category])

  if (loading) {
    return (
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Benzer Ürünler</h2>
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-8">Benzer Ürünler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default SimilarProducts