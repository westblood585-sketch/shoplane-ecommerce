import { Link } from 'react-router-dom'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import useOrderStore from '../../store/orderStore'

function OrdersPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.orders.description, metaDescriptions.orders.title)
  const { orders } = useOrderStore()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={24} />
      case 'shipped':
        return <Truck className="text-blue-600" size={24} />
      case 'delivered':
        return <CheckCircle className="text-green-600" size={24} />
      default:
        return <Package className="text-gray-600" size={24} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
        </div>

        {/* Siparişler */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package size={80} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Henüz Siparişiniz Yok</h3>
            <p className="text-gray-600 mb-6">İlk siparişinizi verin, hızlıca size ulaştıralım!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Sipariş Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">Sipariş No: {order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                        {order.statusText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₺{order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.items.length} ürün</p>
                  </div>
                </div>

                {/* Sipariş İçeriği */}
                <div className="p-6">
                  {/* Ürünler */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            <span>Beden: {item.size}</span>
                            <span className="mx-2">•</span>
                            <span>Renk: {item.color}</span>
                            <span className="mx-2">•</span>
                            <span>Adet: {item.quantity}</span>
                          </div>
                          <p className="font-semibold text-blue-600 mt-1">
                            ₺{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Kargo Bilgisi */}
                  {order.trackingNumber && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {order.cargoCompany}
                          </p>
                          <p className="text-sm text-gray-600">
                            Takip No: <span className="font-mono font-bold">{order.trackingNumber}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Teslimat Adresi */}
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.district} / {order.shippingAddress.city}</p>
                      <p>Posta Kodu: {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      <Eye size={20} />
                      Detayları Gör
                    </Link>

                    {order.trackingNumber && (
                      <a
                        href={`https://gonderitakip.com/${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                      >
                        <Truck size={20} />
                        Kargoyu Takip Et
                      </a>
                    )}

                    <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                      Fatura İndir
                    </button>

                    {order.status === 'delivered' && (
                      <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition">
                        İade Talebi Oluştur
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default OrdersPage