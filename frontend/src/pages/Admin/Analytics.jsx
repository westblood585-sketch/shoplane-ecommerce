import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  Calendar, Clock, BarChart3, PieChart, LineChart
} from 'lucide-react'
import {
  LineChart as RechartsLine, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import API from '../../api/axiosConfig'

function Analytics() {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/analytics/dashboard?period=${period}`)
      setStats(response.data)
    } catch (error) {
      console.error('Error:', error)
      // Mock data fallback
      setStats({
        stats: {
          revenue: { total: 50000, growth: 15, avgOrderValue: 500 },
          orders: { total: 100, growth: 10 },
          users: { new: 25, growth: 5 }
        },
        salesTrend: [
          { _id: '1', revenue: 5000 },
          { _id: '2', revenue: 6000 },
          { _id: '3', revenue: 5500 }
        ],
        salesByCategory: [
          { _id: 'Elektronik', revenue: 20000 },
          { _id: 'Giyim', revenue: 15000 },
          { _id: 'Diğer', revenue: 15000 }
        ],
        topProducts: [
          { productName: 'Ürün 1', totalSold: 50 },
          { productName: 'Ürün 2', totalSold: 40 }
        ],
        hourlyOrders: [
          { _id: '00:00', count: 5 },
          { _id: '12:00', count: 15 }
        ],
        recentOrders: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold dark:text-dark-text">Yükleniyor...</div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-20 dark:text-dark-text">Veri bulunamadı</div>
  }

  const periods = [
    { value: 'today', label: 'Bugün' },
    { value: 'week', label: 'Bu Hafta' },
    { value: 'month', label: 'Bu Ay' },
    { value: 'year', label: 'Bu Yıl' }
  ]

  // KPI Cards
  const kpiCards = [
    {
      title: 'Toplam Gelir',
      value: `₺${stats.stats.revenue.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      change: stats.stats.revenue.growth,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Toplam Sipariş',
      value: stats.stats.orders.total,
      change: stats.stats.orders.growth,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Yeni Kullanıcılar',
      value: stats.stats.users.new,
      change: stats.stats.users.growth,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Ortalama Sipariş Değeri',
      value: `₺${stats.stats.revenue.avgOrderValue}`,
      change: 0,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  // Kategori renkleri
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

  return (
    <div className="p-6 bg-gray-50 dark:bg-dark-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-dark-text">Analitik Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detaylı satış ve performans istatistikleri
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                period === p.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-2xl p-6 border dark:border-dark-border`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
              {card.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  card.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(card.change)}%
                </div>
              )}
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-2">{card.title}</h3>
            <p className="text-3xl font-bold dark:text-dark-text">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-dark-text flex items-center gap-2">
              <LineChart size={24} className="text-blue-600" />
              Satış Trendi (Son 30 Gün)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.salesTrend || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                name="Gelir (₺)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-dark-text flex items-center gap-2">
              <PieChart size={24} className="text-purple-600" />
              Kategori Bazlı Satışlar
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={stats.salesByCategory || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {stats.salesByCategory?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-dark-text flex items-center gap-2">
              <BarChart3 size={24} className="text-green-600" />
              En Çok Satan Ürünler
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topProducts?.slice(0, 8) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="productName" stroke="#6B7280" hide />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="totalSold" fill="#10B981" name="Satış Adedi" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-dark-text flex items-center gap-2">
              <Clock size={24} className="text-orange-600" />
              Saatlik Sipariş Dağılımı (Bugün)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLine data={stats.hourlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Sipariş Sayısı"
                dot={{ fill: '#F59E0B', r: 5 }}
              />
            </RechartsLine>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-6 border dark:border-dark-border"
        >
          <h2 className="text-xl font-bold mb-6 dark:text-dark-text">Son Siparişler</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Sipariş No</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Müşteri</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Tutar</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Durum</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition">
                    <td className="py-3 px-4 font-mono text-sm dark:text-dark-text">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 dark:text-dark-text">
                      <div>
                        <div className="font-semibold">{order.user?.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold dark:text-dark-text">
                      ₺{order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {order.status === 'pending' ? 'Beklemede' :
                        order.status === 'processing' ? 'İşleniyor' :
                        order.status === 'shipped' ? 'Kargoda' :
                        order.status === 'delivered' ? 'Teslim Edildi' :
                        'İptal Edildi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Analytics
