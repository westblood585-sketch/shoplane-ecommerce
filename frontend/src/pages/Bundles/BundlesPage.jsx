import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Sparkles } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import BundleCard from '../../components/bundles/BundleCard'
import API from '../../api/axiosConfig'

function BundlesPage() {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      const response = await API.get('/bundles?active=true')
      setBundles(response.data.bundles)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-16 md:pb-0">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
              <Sparkles size={20} />
              <span className="font-semibold">Özel Paketler</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Paket İndirimleri</h1>
            <p className="text-xl opacity-90">
              Birlikte alın, daha çok kazanın! %50'ye varan indirimler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <BundleCard key={bundle._id} bundle={bundle} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2 dark:text-dark-text">
              Henüz Paket Yok
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Yakında yeni paket fırsatları eklenecek!
            </p>
          </div>
        )}
      </section>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default BundlesPage
