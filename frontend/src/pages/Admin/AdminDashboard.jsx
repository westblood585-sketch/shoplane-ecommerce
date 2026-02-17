import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Settings, LogOut, BarChart3, Award, Activity 
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/layout/Navbar'
import Analytics from './Analytics'
import DashboardPage from './DashboardPage'
import AdminProductsPage from './AdminProductsPage'
import AdminOrdersPage from './AdminOrdersPage'

function AdminDashboard() {
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analitik' },
    { path: '/admin/products', icon: Package, label: 'Ürünler' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Siparişler' },
    { path: '/admin/users', icon: Users, label: 'Kullanıcılar' },
    { path: '/admin/settings', icon: Settings, label: 'Ayarlar' }
  ]

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-dark-card min-h-screen border-r dark:border-dark-border sticky top-16">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path, item.exact)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition mt-4"
              >
                <LogOut size={20} />
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route index element={<DashboardHome user={user} />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<div className="p-6 dark:text-dark-text"><h1 className="text-3xl font-bold mb-4">Kullanıcılar</h1><p>Kullanıcılar sayfası - Yakında eklenecek</p></div>} />
            <Route path="settings" element={<div className="p-6 dark:text-dark-text"><h1 className="text-3xl font-bold mb-4">Ayarlar</h1><p>Ayarlar sayfası - Yakında eklenecek</p></div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function DashboardHome({ user }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 dark:text-dark-text">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Hoş geldiniz! Soldaki menüden istediğiniz bölüme geçebilirsiniz.
      </p>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Toplam Satış</div>
          <div className="text-3xl font-bold mt-2 dark:text-dark-text">₺0</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Toplam Sipariş</div>
          <div className="text-3xl font-bold mt-2 dark:text-dark-text">0</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Toplam Ürün</div>
          <div className="text-3xl font-bold mt-2 dark:text-dark-text">0</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Toplam Kullanıcı</div>
          <div className="text-3xl font-bold mt-2 dark:text-dark-text">0</div>
        </div>
      </div>
      {/* New Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/analytics/comprehensive"
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white hover:shadow-2xl transition"
        >
          <Activity size={40} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
          <p className="opacity-90">Comprehensive business intelligence</p>
        </Link>
        <Link
          to="/admin/bundles"
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white hover:shadow-2xl transition"
        >
          <Package size={40} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Bundle Manager</h3>
          <p className="opacity-90">Manage product bundles</p>
        </Link>
        <Link
          to="/admin/loyalty/stats"
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transition"
        >
          <Award size={40} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Loyalty Stats</h3>
          <p className="opacity-90">Program performance</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
