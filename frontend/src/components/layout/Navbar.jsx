import { Link } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, Camera, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import SmartSearch from '../common/SmartSearch'
import MegaMenu from './MegaMenu'
import DarkModeToggle from '../common/DarkModeToggle'
import VisualSearch from '../search/VisualSearch'

function Navbar() {
  const { getTotalItems } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showVisualSearch, setShowVisualSearch] = useState(false)
  
  const totalItems = getTotalItems()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  }

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-dark-bg shadow-sm border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP ROW */}
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* LEFT: Mobile Menu + Logo */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
                aria-label="Menu"
              >
                <Menu size={20} className="dark:text-dark-text" />
              </motion.button>

              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  MyShop
                </span>
              </Link>
            </div>

            {/* CENTER: Search Bar (Desktop Only) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="w-full flex gap-2">
                <div className="flex-1">
                  <SmartSearch />
                </div>
                {/* Visual Search Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVisualSearch(true)}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition flex-shrink-0 flex items-center gap-1"
                  title="Görsel Arama"
                >
                  <Camera size={18} />
                  <span className="text-xs font-medium hidden lg:block">Görsel</span>
                </motion.button>
              </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              
              {/* Dark Mode Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <DarkModeToggle />
              </motion.div>

              {/* User Menu or Login */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition group"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-sm hidden lg:block dark:text-dark-text truncate max-w-xs">
                      {user?.name}
                    </span>
                    <ChevronDown size={16} className="dark:text-dark-text group-hover:rotate-180 transition" />
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-xl py-1 z-20 border border-gray-100 dark:border-dark-border overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Hesap</p>
                            <p className="font-semibold text-sm dark:text-dark-text truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          </div>

                          {/* Menu Items */}
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-dark-text transition text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            👤 Profilim
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-dark-text transition text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            📦 Siparişlerim
                          </Link>
                          <Link
                            to="/addresses"
                            className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-dark-text transition text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            📍 Adreslerim
                          </Link>
                          <Link
                            to="/favorites"
                            className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-dark-text transition text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            ❤️ Favorilerim
                          </Link>

                          {/* Admin Section */}
                          {user?.role === 'admin' && (
                            <>
                              <div className="my-1 border-t border-gray-100 dark:border-dark-border" />
                              <Link
                                to="/admin"
                                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition text-sm font-semibold"
                                onClick={() => setShowUserMenu(false)}
                              >
                                ⚙️ Admin Panel
                              </Link>
                            </>
                          )}

                          {/* Logout */}
                          <div className="border-t border-gray-100 dark:border-dark-border" />
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition text-sm font-semibold flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Çıkış Yap
                          </motion.button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                >
                  <User size={18} />
                  <span className="hidden sm:block">Giriş</span>
                </Link>
              )}

              {/* Cart Button */}
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/cart" 
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition group"
                  aria-label="Sepet"
                >
                  <ShoppingCart size={20} className="dark:text-dark-text group-hover:text-blue-600 transition" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      >
                        {totalItems > 99 ? '99+' : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="md:hidden pb-3">
            <button
              onClick={() => setShowMobileSearch(true)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-dark-hover rounded-lg text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-dark-border transition flex items-center gap-2"
            >
              <Camera size={16} />
              Ara veya görsel ara...
            </button>
          </div>
        </div>

        {/* MEGA MENU */}
        <div className="border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-hover">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <MegaMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Visual Search Modal */}
      <VisualSearch isOpen={showVisualSearch} onClose={() => setShowVisualSearch(false)} />

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-dark-bg z-50 p-4 md:hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
                aria-label="Kapat"
              >
                <X size={24} className="dark:text-dark-text" />
              </motion.button>
              <h2 className="text-lg font-bold dark:text-dark-text">Ara</h2>
            </div>
            <SmartSearch isMobile onClose={() => setShowMobileSearch(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
