import { useState } from 'react'
import { User, Mail, Phone, Lock, Camera, MapPin, Package, Heart, Gift, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BottomNav from '../../components/layout/BottomNav'
import useAuthStore from '../../store/authStore'

function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Profil Bilgileri
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  // Şifre Değiştirme
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const result = await updateProfile(profileData)
    setLoading(false)

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil bilgileriniz güncellendi!' })
    } else {
      setMessage({ type: 'error', text: result.error })
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor!' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır!' })
      return
    }

    setLoading(true)
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)
    setLoading(false)

    if (result.success) {
      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      setMessage({ type: 'error', text: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          Ana Sayfa / <span className="text-gray-900 font-semibold">Profilim</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                      {user?.name?.[0]}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-lg mt-4">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Profil Bilgileri
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'password'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Şifre Değiştir
                </button>
                <Link
                  to="/profile/gamification"
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 hover:bg-purple-50 text-purple-600 font-semibold`}
                >
                  <Zap size={18} />
                  Puan & Rozetler
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Message */}
              {message.text && (
                <div
                  className={`mb-6 px-4 py-3 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Profil Bilgileri */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Profil Bilgileri</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Ad Soyad</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Telefon</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </form>
                </div>
              )}

              {/* Şifre Değiştir */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Şifre Değiştir</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Mevcut Şifre</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Yeni Şifre</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Yeni Şifre Tekrar</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  )
}

export default ProfilePage