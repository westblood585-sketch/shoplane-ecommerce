import { Link, Outlet, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Ürünler', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Siparişler', path: '/admin/orders' },
    { icon: Users, label: 'Kullanıcılar', path: '/admin/users' },
    { icon: Settings, label: 'Ayarlar', path: '/admin/settings' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg z-20 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition mb-2"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 p-6">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminLayout