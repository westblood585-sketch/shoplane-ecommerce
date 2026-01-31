import { Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import SmartSearch from '../common/SmartSearch'
import MegaMenu from './MegaMenu'
import DarkModeToggle from '../common/DarkModeToggle' // YENİ

function Navbar() {
  const { getTotalItems } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  const totalItems = getTotalItems()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
      <nav className="bg-white dark:bg-dark-bg shadow-md sticky top-0 z-50 transition-colors">
        {/* Top Bar */}
        <div className="border-b border-gray-200 dark:border-dark-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden dark:text-dark-text"
              >
                <Menu size={24} />
              </button>

              {/* Logo */}
              <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                MyShop
              </Link>

              {/* Desktop Smart Search */}
              <div className="hidden md:flex flex-1 max-w-xl mx-4">
                <SmartSearch />
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* DARK MODE TOGGLE */}
                <DarkModeToggle />

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 hover:text-blue-600 dark:text-dark-text dark:hover:text-blue-400"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name?.[0]}
                        </div>
                      )}
                      <span className="font-medium hidden lg:block">{user?.name}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-xl py-2 z-20 border dark:border-dark-border">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Profilim
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Siparişlerim
                          </Link>
                          <Link
                            to="/addresses"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Adreslerim
                          </Link>
                          {user?.role === 'admin' && (
                            <>
                              <hr className="my-2 dark:border-dark-border" />
                              <Link
                                to="/admin"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-purple-600 dark:text-purple-400"
                                onClick={() => setShowUserMenu(false)}
                              >
                                Admin Panel
                              </Link>
                            </>
                          )}
                          <hr className="my-2 dark:border-dark-border" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-hover text-red-600 dark:text-red-400 flex items-center gap-2"
                          >
                            <LogOut size={18} />
                            Çıkış Yap
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="hover:text-blue-600 dark:text-dark-text dark:hover:text-blue-400 flex items-center gap-2">
                    <User size={24} />
                    <span className="hidden lg:block font-medium">Giriş Yap</span>
                  </Link>
                )}

                {/* Cart */}
                <Link to="/cart" className="relative hover:text-blue-600 dark:text-dark-text dark:hover:text-blue-400">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MEGA MENU */}
        <div className="border-b border-gray-100 dark:border-dark-border">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <MegaMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white dark:bg-dark-bg z-50 p-4 md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setShowMobileSearch(false)} className="dark:text-dark-text">
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold dark:text-dark-text">Ara</h2>
          </div>
          <SmartSearch isMobile onClose={() => setShowMobileSearch(false)} />
        </div>
      )}
    </>
  )
}

export default Navbar