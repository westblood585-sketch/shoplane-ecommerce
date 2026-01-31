import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import useAuthStore from './store/authStore'
import useFavoriteStore from './store/favoriteStore'
import useThemeStore from './store/themeStore'
import { useNotifications } from './hooks/useNotifications'
import HomePage from './pages/Home/HomePage'
import ProductsPage from './pages/Products/ProductsPage'
import ProductDetailPage from './pages/Products/ProductDetailPage'
import CartPage from './pages/Cart/CartPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ProfilePage from './pages/Profile/ProfilePage'
import AddressesPage from './pages/Profile/AddressesPage'
import OrdersPage from './pages/Profile/OrdersPage'
import OrderDetailPage from './pages/Profile/OrderDetailPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderSuccessPage from './pages/Checkout/OrderSuccessPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import DashboardPage from './pages/Admin/DashboardPage'
import AdminProductsPage from './pages/Admin/AdminProductsPage'
import AdminOrdersPage from './pages/Admin/AdminOrdersPage'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import NotificationToast from './components/common/NotificationToast'
import FavoritesPage from './pages/Favorites/FavoritesPage'
import ComparePage from './pages/Compare/ComparePage'
import ComparisonFloatingButton from './components/comparison/ComparisonFloatingButton'
import ChatWidget from './components/Chat/ChatWidget'
import GamificationProfile from './components/gamification/GamificationProfile'

function App() {
  const { fetchUser, token, isAuthenticated } = useAuthStore()
  const { fetchFavorites } = useFavoriteStore()
  const { notifications, removeNotification, requestNotificationPermission } = useNotifications()

  // Tema yükleme ve listen
  useEffect(() => {
    // İlk yüklemede tema kontrol et
    const isDarkStored = localStorage.getItem('theme-dark') === 'true'
    if (isDarkStored) {
      document.documentElement.classList.add('dark')
    }

    // Storage değişimlerini listen et
    const handleStorageChange = () => {
      const isDark = localStorage.getItem('theme-dark') === 'true'
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (token) {
      fetchUser()
      requestNotificationPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Kullanıcı giriş yaptığında favorileri getir
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchFavorites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token])

  return (
    <>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications && notifications.map(notification => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>

        <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order-success/:id" element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/gamification" element={
            <ProtectedRoute>
              <GamificationProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
          <Route path="/compare" element={<ComparePage />} />
        </Routes>

        <ComparisonFloatingButton />
        {/* Chat Widget */}
        <ChatWidget />
        </div>
      </>
  )
}

export default App