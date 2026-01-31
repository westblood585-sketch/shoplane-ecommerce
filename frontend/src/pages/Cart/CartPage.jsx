import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import CartItem from '../../components/Cart/CartItem'
import CartSummary from '../../components/Cart/CartSummary'
import EmptyCart from '../../components/Cart/EmptyCart'
import useCartStore from '../../store/cartStore'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'

function CartPage() {
  const { items, clearCart } = useCartStore()

  const handleClearCart = () => {
    if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?')) {
      clearCart()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Ana Sayfa</Link>
            {' / '}
            <span className="text-gray-900 font-semibold">Sepetim</span>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft size={20} />
            Alışverişe Devam Et
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Başlık */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">
                Sepetim ({items.length} ürün)
              </h1>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={20} />
                Sepeti Temizle
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sol: Ürün Listesi */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <CartItem key={item.cartId} item={item} />
                ))}
              </div>

              {/* Sağ: Sepet Özeti */}
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>

            {/* Güven Bildirimleri */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-bold mb-2">Hızlı Kargo</h3>
                <p className="text-sm text-gray-600">
                  Siparişiniz 1-3 iş günü içinde kapınızda
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold mb-2">Güvenli Ödeme</h3>
                <p className="text-sm text-gray-600">
                  256-bit SSL sertifikası ile korunan ödeme
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl mb-3">↩️</div>
                <h3 className="font-bold mb-2">14 Gün İade</h3>
                <p className="text-sm text-gray-600">
                  Koşulsuz iade garantisi
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default CartPage