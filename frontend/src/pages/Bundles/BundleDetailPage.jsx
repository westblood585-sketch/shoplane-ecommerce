import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Heart, Check, AlertCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import useCartStore from '../../store/cartStore'
import API from '../../api/axiosConfig'

function BundleDetailPage() {
  const { slug } = useParams()
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedButton, setSelectedButton] = useState('details')
  const { addBundle } = useCartStore()

  useEffect(() => {
    fetchBundle()
  }, [slug])

  const fetchBundle = async () => {
    try {
      const response = await API.get(`/bundles/${slug}`)
      setBundle(response.data.bundle)
    } catch (error) {
      console.error('Error:', error)
      // Simplified error handling without notifications
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!bundle) return

    if (bundle.stock < quantity) {
      console.warn(`Stok yetersiz. Mevcut: ${bundle.stock}`)
      return
    }

    try {
      addBundle(bundle, quantity)
      console.log(`${quantity} ${bundle.name} sepete eklendi`)
      setQuantity(1)
    } catch (error) {
      console.error('Sepete ekleme başarısız:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold dark:text-dark-text mb-2">
            Paket Bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aradığınız paket mevcut değil.
          </p>
        </div>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  const savings = bundle.originalPrice - bundle.bundlePrice
  const savingsPercent = Math.round((savings / bundle.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="sticky top-8">
              <img
                src={bundle.image || bundle.products?.[0]?.product?.images?.[0] || '/default-product-image.svg'}
                alt={bundle.name}
                className="w-full h-96 object-cover rounded-3xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                {bundle.discountPercent}% İndirim
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6">
              <h1 className="text-4xl font-bold dark:text-dark-text mb-2">
                {bundle.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {bundle.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 dark:bg-dark-card rounded-2xl p-6 mb-6 border border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 line-through">
                    {bundle.originalPrice?.toLocaleString('tr-TR')}₺
                  </div>
                  <div className="text-4xl font-bold text-purple-600">
                    {bundle.bundlePrice?.toLocaleString('tr-TR')}₺
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tasarruf</div>
                  <div className="text-2xl font-bold text-green-600">
                    {savings?.toLocaleString('tr-TR')}₺
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    %{savingsPercent} indirim
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            {bundle.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-6">
                <Check size={20} />
                Stok Mevcut ({bundle.stock} adet)
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-6">
                <AlertCircle size={20} />
                Stok Tükendi
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold dark:text-dark-text mb-3">
                Adet Seç
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-xl font-bold dark:text-dark-text w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(bundle.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={bundle.stock === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white font-bold py-4 px-6 rounded-2xl transition-all mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={24} />
              Sepete Ekle
            </button>

            {/* Wishlist Button */}
            <button className="w-full bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover text-gray-700 dark:text-dark-text font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2">
              <Heart size={20} />
              İstek Listesine Ekle
            </button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-dark-border mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedButton('details')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                selectedButton === 'details'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              Paket İçeriği
            </button>
            <button
              onClick={() => setSelectedButton('benefits')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                selectedButton === 'benefits'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              Faydalar
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedButton === 'details' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold dark:text-dark-text">
              Paketa Dahil Ürünler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundle.products?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-dark-border"
                >
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <h3 className="font-bold dark:text-dark-text mb-2 line-clamp-2">
                    {item.product?.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Fiyat
                      </div>
                      <div className="text-xl font-bold text-purple-600">
                        {(item.product?.price || 0).toLocaleString('tr-TR')}₺
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Adet
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        ×{item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Marka: {item.product?.brand}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedButton === 'benefits' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold dark:text-dark-text mb-6">
              Bu Pakettin Avantajları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-900">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-bold text-lg dark:text-dark-text mb-2">
                  {bundle.discountPercent}% Tasarruf
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {savings?.toLocaleString('tr-TR')}₺ tasarruf edin
                </p>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-900">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Package size={24} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-lg dark:text-dark-text mb-2">
                  Eksiksiz Set
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {bundle.products?.length} ürün bir arada
                </p>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-900">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-bold text-lg dark:text-dark-text mb-2">
                  Hızlı Kargo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tüm ürünler aynı ciphada kargo
                </p>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-900">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Check size={24} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-lg dark:text-dark-text mb-2">
                  Ürün Kalitesi Garantili
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tüm ürünler orijinal ve garantilidir
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default BundleDetailPage
