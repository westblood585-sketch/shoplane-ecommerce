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
import PurchaseGiftCard from './pages/GiftCard/PurchaseGiftCard'
import BundlesPage from './pages/Bundles/BundlesPage'
import BundleDetailPage from './pages/Bundles/BundleDetailPage'
import MyPreOrders from './pages/PreOrder/MyPreOrders'
import MySubscriptions from './pages/Subscription/MySubscriptions'
import InfluencerApply from './pages/Influencer/InfluencerApply'
import InfluencerDashboard from './pages/Influencer/InfluencerDashboard'
import { initializeReferralTracking } from './utils/referralTracking'
import ExperimentManager from './pages/Admin/ExperimentManager'
import CreateExperiment from './pages/Admin/CreateExperiment'
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard'
import HeatmapsPage from './pages/Admin/HeatmapsPage'
import SessionReplayPage from './pages/Admin/SessionReplayPage'
import FunnelManager from './pages/Admin/FunnelManager'
import CreateFunnel from './pages/Admin/CreateFunnel'
import FunnelAnalytics from './pages/Admin/FunnelAnalytics'
import { useAnalytics } from './hooks/useAnalytics'
import { useFunnelTracking } from './hooks/useFunnelTracking'
import JourneyAnalytics from './pages/Admin/JourneyAnalytics'
import HighIntentUsers from './pages/Admin/HighIntentUsers'
import JourneyDetail from './pages/Admin/JourneyDetail'
import BundleManager from './pages/Admin/BundleManager'
import ComprehensiveAnalytics from './pages/Admin/ComprehensiveAnalytics'
import LoyaltyStats from './pages/Admin/LoyaltyStats'
import { useJourneyTracking } from './hooks/useJourneyTracking'
import LoyaltyDashboard from './pages/Loyalty/LoyaltyDashboard'
import RewardsPage from './pages/Loyalty/RewardsPage'
import LeaderboardPage from './pages/Loyalty/LeaderboardPage'
import AboutPage from './pages/Info/AboutPage'
import ContactPage from './pages/Info/ContactPage'
import FAQPage from './pages/Info/FAQPage'
import PrivacyPage from './pages/Info/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'
import OrganizationSchema from './components/seo/OrganizationSchema'

function App() {
  const { fetchUser, token, isAuthenticated } = useAuthStore()
  const { fetchFavorites } = useFavoriteStore()
  const { notifications, removeNotification, requestNotificationPermission } = useNotifications()
  
  // Initialize analytics tracking
  useAnalytics()

  // E-commerce funnel tracking
  const ecommerceFunnelSteps = [
    { name: 'Homepage', type: 'pageview', url: '/', order: 0 },
    { name: 'Product View', type: 'pageview', urlPattern: '/products/.*', order: 1 },
    { name: 'Add to Cart', type: 'event', eventName: 'add_to_cart', order: 2 },
    { name: 'Checkout', type: 'pageview', url: '/checkout', order: 3 },
    { name: 'Purchase', type: 'event', eventName: 'purchase', order: 4 }
  ]

  const { trackEvent } = useFunnelTracking('6991a785fa6dd17fb9521714', ecommerceFunnelSteps)

  // Expose trackEvent globally for cart and checkout
  window.trackFunnelEvent = trackEvent

  // Journey tracking
  const { trackTouchpoint } = useJourneyTracking()

  // Expose globally for easy access
  window.trackJourneyTouchpoint = trackTouchpoint

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
    // Referral tracking başlat
    initializeReferralTracking()
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
      {/* Organization Schema (Global SEO) */}
      <OrganizationSchema />
      
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
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/bundles/:slug" element={<BundleDetailPage />} />
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
          <Route path="/pre-orders" element={
            <ProtectedRoute>
              <MyPreOrders />
            </ProtectedRoute>
          } />
          <Route path="/subscriptions" element={
            <ProtectedRoute>
              <MySubscriptions />
            </ProtectedRoute>
          } />
          <Route path="/influencer/apply" element={<InfluencerApply />} />
          <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />

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
          <Route path="/gift-cards/purchase" element={<PurchaseGiftCard />} />
          <Route path="/admin/experiments" element={<ExperimentManager />} />
          <Route path="/admin/experiments/create" element={<CreateExperiment />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/analytics/heatmaps" element={<HeatmapsPage />} />
          <Route path="/admin/analytics/session/:sessionId" element={<SessionReplayPage />} />
          <Route path="/admin/funnels" element={<FunnelManager />} />
          <Route path="/admin/funnels/create" element={<CreateFunnel />} />
          <Route path="/admin/funnels/:id" element={<FunnelAnalytics />} />
          
          {/* Journey Routes */}
          <Route path="/admin/journeys" element={<JourneyAnalytics />} />
          <Route path="/admin/journeys/high-intent" element={<HighIntentUsers />} />
          <Route path="/admin/journeys/:journeyId" element={<JourneyDetail />} />
          
          {/* Bundle Routes */}
          <Route path="/admin/bundles" element={<BundleManager />} />
          <Route path="/admin/analytics/comprehensive" element={<ComprehensiveAnalytics />} />
          <Route path="/admin/loyalty/stats" element={<LoyaltyStats />} />

          {/* Loyalty Routes */}
          <Route path="/loyalty" element={<LoyaltyDashboard />} />
          <Route path="/loyalty/rewards" element={<RewardsPage />} />
          <Route path="/loyalty/leaderboard" element={<LeaderboardPage />} />
          
          {/* Info Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* 404 Route (Must be last) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <ComparisonFloatingButton />
        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </>
  )
}

export default App