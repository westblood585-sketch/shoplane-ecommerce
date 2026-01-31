import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

function BottomNav() {
  const location = useLocation()
  const { getTotalItems } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const totalItems = getTotalItems()

  const navItems = [
    { icon: Home, label: 'Ana Sayfa', path: '/' },
    { icon: Search, label: 'Keşfet', path: '/products' },
    { icon: ShoppingCart, label: 'Sepet', path: '/cart', badge: totalItems },
    { icon: User, label: 'Profil', path: isAuthenticated ? '/profile' : '/login' }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-4 py-2 transition ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon size={24} />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav