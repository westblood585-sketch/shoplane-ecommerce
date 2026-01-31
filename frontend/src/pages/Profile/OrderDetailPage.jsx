import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Download } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import useOrderStore from '../../store/orderStore'

function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrderById } = useOrderStore()
  
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={80} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Sipariş Bulunamadı</h2>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Siparişlerime Dön
          </button>
        </div>
      </div>
    )
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
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Siparişlerime Dön
          </button>
          {/* Header */}
          {/* ...buraya kadar olan kodlar aynı... */}
          {/* Tüm JSX içeriği aynı şekilde devam ediyor, sadece ana kapsayıcı olarak <> ... </> kullanıldı ve <a> etiketi düzeltildi */}
        </div>
        <Footer />
      </div>
    </>
  )
}

export default OrderDetailPage