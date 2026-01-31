import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import ProductCard from '../../components/common/ProductCard'
import useFavoriteStore from '../../store/favoriteStore'
import useCartStore from '../../store/cartStore'

function FavoritesPage() {
  const { favorites, loading, fetchFavorites } = useFavoriteStore()
  const { addItem } = useCartStore()

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleAddAllToCart = () => {
    favorites.forEach(fav => {
      addItem(fav.product, 'M', fav.product.colors?.[0] || 'Standart', 1)
    })
    alert('Tüm favoriler sepete eklendi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="text-red-500" size={36} />
              Favorilerim
            </h1>
            <p className="text-gray-600">
              {favorites.length} ürün favorilerinizde
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <ShoppingCart size={20} />
              Tümünü Sepete Ekle
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
              <Heart size={80} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Favori Ürününüz Yok</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Beğendiğiniz ürünleri favorilere ekleyin, daha sonra kolayca bulun!
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(favorite => (
              <ProductCard key={favorite._id} product={favorite.product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default FavoritesPage