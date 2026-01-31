import { X, Home, ShoppingBag, User, Heart, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from '../../store/authStore'

function MobileMenu({ isOpen, setIsOpen }) {
  const { isAuthenticated, user } = useAuthStore()

  // Menu açıldığında body overflow kontrolü
  useEffect(() => {
    if (isOpen) {
      // Scrollbar kaymını önlemek için padding ekle
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', path: '/' },
    { icon: ShoppingBag, label: 'Ürünler', path: '/products' },
    { icon: Heart, label: 'Favoriler', path: '/favorites' },
    { icon: User, label: 'Profilim', path: '/profile', auth: true },
    { icon: Settings, label: 'Ayarlar', path: '/settings', auth: true }
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-80 bg-white z-50 shadow-2xl
        transform transition-transform duration-300 md:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-blue-600">MyShop</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              if (item.auth && !isAuthenticated) return null
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Login/Logout */}
          {!isAuthenticated && (
            <div className="mt-6 pt-6 border-t space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 border-2 border-blue-600 text-blue-600 text-center rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileMenu