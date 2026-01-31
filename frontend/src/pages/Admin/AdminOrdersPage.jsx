import { useState, useEffect } from 'react'
import { orderAPI } from '../../api/orderAPI'
import { Eye, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAllOrders()
      setOrders(data.orders)
    } catch (error) {
      console.error('Orders fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Durum güncellenemedi')
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'pending', label: 'Hazırlanıyor' },
    { value: 'processing', label: 'İşleniyor' },
    { value: 'shipped', label: 'Kargoda' },
    { value: 'delivered', label: 'Teslim Edildi' },
    { value: 'cancelled', label: 'İptal Edildi' }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sipariş Yönetimi</h1>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6">Sipariş No</th>
                  <th className="text-left py-4 px-6">Müşteri</th>
                  <th className="text-left py-4 px-6">Ürün Sayısı</th>
                  <th className="text-left py-4 px-6">Tutar</th>
                  <th className="text-left py-4 px-6">Durum</th>
                  <th className="text-left py-4 px-6">Tarih</th>
                  <th className="text-left py-4 px-6">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{order.items.length} ürün</td>
                    <td className="py-4 px-6 font-semibold">₺{order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="pending">Hazırlanıyor</option>
                        <option value="processing">İşleniyor</option>
                        <option value="shipped">Kargoda</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="py-4 px-6">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Eye size={18} />
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
) }
export default AdminOrdersPage