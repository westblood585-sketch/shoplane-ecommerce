import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Gift, TrendingUp, Award, Zap } from 'lucide-react'
import API from '../../api/axiosConfig'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import BottomNav from '../layout/BottomNav'
import SpinWheel from './SpinWheel'

function GamificationProfile() {
  const [profile, setProfile] = useState(null)
  const [badges, setBadges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError(null)
      try {
        const [profileRes, badgesRes, leaderboardRes] = await Promise.all([
          API.get('/gamification/profile'),
          API.get('/gamification/badges'),
          API.get('/gamification/leaderboard')
        ])

        setProfile(profileRes.data.profile)
        setBadges(badgesRes.data.badges)
        setLeaderboard(leaderboardRes.data.leaderboard)
      } catch (apiError) {
        console.warn('API Hatası, mock veriler kullanılıyor:', apiError)
        // Mock verilerle yükle
        setProfile({
          userId: 'user_123',
          username: 'Kullanıcı',
          totalPoints: 2850,
          currentLevel: 4,
          nextLevelPoints: 5000,
          progressToNextLevel: 57,
          pointsToNextLevel: 2150,
          totalPurchases: 15,
          badges: 8,
          streak: 12,
          stats: {
            totalOrders: 15,
            totalSpent: 4250.00
          }
        })
        setBadges([
          { id: 1, name: 'İlk Satın Alma', icon: '🎁', description: 'İlk ürünü satın aldı' },
          { id: 2, name: 'Hızlı Alıcı', icon: '⚡', description: '24 saat içinde 5 ürün satın aldı' },
          { id: 3, name: 'Sevilen Müşteri', icon: '❤️', description: '50+ ürüne favori ekledi' },
          { id: 4, name: 'Sadık Müşteri', icon: '👑', description: '1 ayda 10+ satın alma' },
          { id: 5, name: 'İncelemeci', icon: '⭐', description: '10+ ürün değerlendirdi' },
          { id: 6, name: 'Sosyal Paylaşıcı', icon: '📱', description: '3+ ürünü sosyal ağlarda paylaştı' },
          { id: 7, name: 'Başvuru Yapan', icon: '✉️', description: 'Bültenimize abone oldu' },
          { id: 8, name: 'VIP Üyesi', icon: '💎', description: '5000+ puan topladı' }
        ])
        setLeaderboard([
          { rank: 1, username: 'AhmetK', points: 12500, level: 8 },
          { rank: 2, username: 'FatihS', points: 11200, level: 7 },
          { rank: 3, username: 'EzgiD', points: 10800, level: 7 },
          { rank: 4, username: 'MerveB', points: 9500, level: 6 },
          { rank: 5, username: 'OkanT', points: 8200, level: 6 }
        ])
      }
    } catch (error) {
      console.error('Genel Hata:', error)
      setError('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Veri Yüklenemedi</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">Profil Bulunamadı</h2>
            <p className="text-yellow-600">Lütfen daha sonra tekrar deneyin.</p>
          </div>
        </div>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Oyunlaştırma</h1>
          <p className="text-gray-600">Puan kazan, rozet topla, liderlik tablosunda yüksel!</p>
        </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Daily Spin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <Trophy size={24} />
                  <span className="text-2xl font-bold">Seviye {profile.level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{profile.points}</div>
                <div className="text-sm opacity-90">Toplam Puan</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Bir sonraki seviyeye</span>
                <span className="font-bold">{profile.pointsToNextLevel} puan kaldı</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.progressToNextLevel}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Daily Spin Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Gift size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Günlük Şans Çarkı</h3>
                  <p className="text-gray-600">
                    {profile.dailySpinAvailable 
                      ? 'Bugünkü çevirme hakkın hazır!' 
                      : 'Yarın tekrar dene!'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSpinWheel(true)}
                disabled={!profile.dailySpinAvailable}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profile.dailySpinAvailable ? 'Çevir! 🎰' : 'Yarın Gel'}
              </button>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={24} className="text-yellow-500" />
              <h3 className="text-2xl font-bold">Rozetlerim</h3>
              <span className="ml-auto text-gray-600">
                {badges.filter(b => b.earned).length}/{badges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition ${
                    badge.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-bold mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  {badge.earned && (
                    <div className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1">
                      <Star size={12} />
                      +{badge.points} puan
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Leaderboard */}
        <div className="space-y-6">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              İstatistikler
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Sipariş</span>
                <span className="font-bold">{profile.stats.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Harcama</span>
                <span className="font-bold">₺{profile.stats.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kazanılan Rozet</span>
                <span className="font-bold">{badges.filter(b => b.earned).length}</span>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.2 }}
className="bg-white rounded-2xl p-6 shadow-lg"
>
<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
<Trophy className="text-yellow-500" size={20} />
Liderlik Tablosu
</h3>
<div className="space-y-3">
{leaderboard.slice(0, 10).map((user, index) => (
<div
key={index}
className={`flex items-center gap-3 p-3 rounded-lg ${
  index < 3
    ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
    : 'bg-gray-50'
} `}
>
<div
className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
  index === 0
    ? 'bg-yellow-500 text-white'
    : index === 1
    ? 'bg-gray-400 text-white'
    : index === 2
    ? 'bg-orange-600 text-white'
    : 'bg-gray-300 text-gray-700'
} `}
>
{user.rank}
</div>
<div className="flex-1">
<div className="font-semibold">{user.name}</div>
<div className="text-xs text-gray-600">Level {user.level}</div>
</div>
<div className="text-right">
<div className="font-bold text-purple-600">{user.points}</div>
<div className="text-xs text-gray-600">puan</div>
</div>
</div>
))}
</div>
</motion.div>
</div>
</div>
  {/* Spin Wheel Modal */}
  <SpinWheel
    isOpen={showSpinWheel}
    onClose={() => setShowSpinWheel(false)}
    onWin={(prize) => {
      console.log('Won:', prize)
      // Profili yenile
      setTimeout(() => fetchData(), 2000)
    }}
  />
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
export default GamificationProfile
