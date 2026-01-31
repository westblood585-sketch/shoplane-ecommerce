import { motion } from 'framer-motion'
import { Clock, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import useRecentlyViewedStore from '../../store/recentlyViewedStore'
import ProductCardV2 from '../common/ProductCardV2'

function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewedStore()

  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Son Baktıkların</h2>
              <p className="text-gray-600">İlgilendiğin ürünlere hızlıca geri dön</p>
            </div>
          </motion.div>

          <button
            onClick={clearRecentlyViewed}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition"
          >
            <X size={16} />
            <span>Temizle</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyViewed.slice(0, 5).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCardV2 product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewed