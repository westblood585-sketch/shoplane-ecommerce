import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home, Gift } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import useOrderStore from '../../store/orderStore'
import confetti from 'canvas-confetti'

function OrderSuccessPage() {
  const { id } = useParams()
  const { fetchOrder, currentOrder } = useOrderStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Konfeti animasyonu
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Sipariş detayını getir
    const loadOrder = async () => {
      await fetchOrder(id)
      setLoading(false)
    }

    loadOrder()
  }, [id, fetchOrder])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sipariş bulunamadı</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
            <CheckCircle size={80} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Siparişiniz Alındı! 🎉</h1>
          <p className="text-xl text-gray-600 mb-2">
            Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.
          </p>
          <p className="text-gray-600">
            Sipariş numaranız: <span className="font-mono font-bold text-blue-600">{currentOrder.orderNumber}</span>
          </p>
        </div>

        {/* Sipariş Bilgileri */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Package className="mx-auto text-blue-600 mb-3" size={40} />
              <h3 className="font-bold mb-1">Sipariş Durumu</h3>
              <p className="text-sm text-gray-600">Hazırlanıyor</p>
            </div>

            <div>
              <Truck className="mx-auto text-blue-600 mb-3" size={40} />
              <h3 className="font-bold mb-1">Tahmini Teslimat</h3>
              <p className="text-sm text-gray-600">2-4 iş günü</p>
            </div>

            <div>
              <Home className="mx-auto text-blue-600 mb-3" size={40} />
              <h3 className="font-bold mb-1">Teslimat Adresi</h3>
              <p className="text-sm text-gray-600">
                {currentOrder.shippingAddress.district}, {currentOrder.shippingAddress.city}
              </p>
            </div>
          </div>
        </div>

        {/* Gift Wrap Display - YENİ */}
        {currentOrder.giftWrap?.enabled && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-900 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{currentOrder.giftWrap.icon || '🎁'}</div>
              <div>
                <h3 className="text-xl font-bold dark:text-dark-text">Hediye Paketi Eklendi</h3>
                <p className="text-gray-600 dark:text-gray-400">Siparişiniz özel paketlenecek</p>
              </div>
            </div>

            {currentOrder.giftWrap.message && (
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border-2 border-pink-200 dark:border-pink-900">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💌</span>
                  <span className="font-semibold dark:text-dark-text">Hediye Mesajınız:</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-3">
                  "{currentOrder.giftWrap.message}"
                </p>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Kimden: <strong>{currentOrder.giftWrap.from}</strong></span>
                  <span>Kime: <strong>{currentOrder.giftWrap.to}</strong></span>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ✨ <strong>Not:</strong> Pakette fiyat etiketi olmayacak ve hediye kartınız eklenecektir.
              </p>
            </div>
          </div>
        )}

        {/* Sipariş Detayları */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Sipariş Detayları</h2>

          <div className="space-y-4 mb-6">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.size} • {item.color} • {item.quantity}x
                  </p>
                  <p className="font-bold text-blue-600">
                    ₺{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam:</span>
              <span className="font-semibold">₺{currentOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo:</span>
              <span className="font-semibold">
                {currentOrder.shippingPrice === 0 ? (
                  <span className="text-green-600">ÜCRETSİZ</span>
                ) : (
                  `₺${currentOrder.shippingPrice.toFixed(2)}`
                )}
              </span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim:</span>
                <span className="font-semibold">-₺{currentOrder.discount.toFixed(2)}</span>
              </div>
            )}
            {currentOrder.giftWrap?.enabled && (
              <div className="flex justify-between text-pink-600">
                <span>🎁 Hediye Paketi:</span>
                <span className="font-semibold">+₺{currentOrder.giftWrap.price.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Toplam:</span>
              <span className="text-blue-600">₺{currentOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to={`/orders/${currentOrder._id}`}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Siparişi Görüntüle
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Bilgilendirme */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold mb-3">📧 E-posta Gönderildi</h3>
          <p className="text-sm text-gray-700">
            Sipariş detaylarınız e-posta adresinize gönderilmiştir. Kargo takip numaranız oluştuğunda size bilgi vereceğiz.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OrderSuccessPage