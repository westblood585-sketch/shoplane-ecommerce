import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home } from 'lucide-react'
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