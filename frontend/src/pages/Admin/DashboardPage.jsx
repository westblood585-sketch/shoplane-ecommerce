import { useEffect, useState } from 'react'
import { analyticsAPI } from '../../api/analyticsAPI'
import { Package, ShoppingCart, TrendingUp, Users, ArrowUp, ArrowDown } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [salesTrend, setSalesTrend] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesByCategory, setSalesByCategory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsAPI.getDashboardStats()
      setStats(data.stats)
      setSalesTrend(data.salesTrend)
      setTopProducts(data.topProducts)
      setSalesByCategory(data.salesByCategory)
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUp size={16} />
              <span className="text-sm font-semibold">+12%</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Toplam Sipariş</h3>
          <p className="text-2xl font-bold">{stats.orders.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUp size={16} />
              <span className="text-sm font-semibold">+8%</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Toplam Gelir</h3>
          <p className="text-2xl font-bold">₺{stats.revenue.total.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUp size={16} />
              <span className="text-sm font-semibold">+5%</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Toplam Ürün</h3>
          <p className="text-2xl font-bold">{stats.products.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Users size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUp size={16} />
              <span className="text-sm font-semibold">+15%</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Toplam Kullanıcı</h3>
          <p className="text-2xl font-bold">{stats.users.total}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Satış Trendi (Son 30 Gün)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Gelir (₺)" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Sipariş Sayısı" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Kategori Bazlı Satışlar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry._id}: ${entry.totalSales}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="totalSales"
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">En Çok Satan Ürünler</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Ürün</th>
                <th className="text-left py-3 px-4">Kategori</th>
                <th className="text-left py-3 px-4">Satış Adedi</th>
                <th className="text-left py-3 px-4">Gelir</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-semibold">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{item.product.category}</td>
                  <td className="py-3 px-4 font-semibold">{item.totalSold}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ₺{item.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage