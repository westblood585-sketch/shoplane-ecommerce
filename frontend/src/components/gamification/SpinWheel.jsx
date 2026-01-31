import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Sparkles } from 'lucide-react'
import API from '../../api/axiosConfig'

function SpinWheel({ isOpen, onClose, onWin }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)

  const prizes = [
    { label: '50 Puan', color: '#FF6B6B', angle: 0 },
    { label: '%10 İndirim', color: '#4ECDC4', angle: 45 },
    { label: '100 Puan', color: '#FFE66D', angle: 90 },
    { label: '%20 İndirim', color: '#95E1D3', angle: 135 },
    { label: '200 Puan', color: '#F38181', angle: 180 },
    { label: 'Ücretsiz Kargo', color: '#AA96DA', angle: 225 },
    { label: '500 Puan', color: '#FCBAD3', angle: 270 },
    { label: '%50 İndirim', color: '#A8E6CF', angle: 315 }
  ]

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)

    try {
      // Backend'den ödül al
      const response = await API.post('/gamification/spin')
      const prize = response.data.prize

      // Ödüle göre rotasyon hesapla
      const prizeIndex = prizes.findIndex(p => p.label === prize.label)
      const targetAngle = prizes[prizeIndex]?.angle || 0
      
      // 5 tur + hedef açı
      const spins = 5 * 360 + (360 - targetAngle)
      const finalRotation = rotation + spins

      setRotation(finalRotation)

      // Animasyon bitince sonucu göster
      setTimeout(() => {
        setResult(prize)
        setIsSpinning(false)
        onWin?.(prize)
      }, 4000)

    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
      alert(error.response?.data?.message || 'Bir hata oluştu')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
              >
                <X size={24} />
              </button>

              {/* Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                  <Gift className="text-purple-600" size={24} />
                  <span className="text-purple-600 font-bold">Günlük Şans Çarkı</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">Çarkı Çevir, Kazan!</h2>
                <p className="text-gray-600">Her gün 1 çevirme hakkın var</p>
              </div>

              {/* Wheel Container */}
              <div className="relative mx-auto w-96 h-96 mb-8">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <motion.div
                  className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
                  animate={{ rotate: rotation }}
                  transition={{
                    duration: 4,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  style={{
                    background: `conic-gradient(${prizes.map((p, i) => 
                      `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`
                    ).join(', ')})`
                  }}
                >
                  {/* Prize Labels */}
                  {prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 origin-left"
                      style={{
                        transform: `rotate(${prize.angle + 22.5}deg) translateX(80px)`,
                        width: '120px'
                      }}
                    >
                      <div
                        className="text-white font-bold text-sm text-center drop-shadow-lg"
                        style={{ transform: `rotate(-${prize.angle + 22.5}deg)` }}
                      >
                        {prize.label}
                      </div>
                    </div>
                  ))}

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-400">
                    <Sparkles className="text-yellow-500" size={32} />
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              {!result && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSpinning ? 'Çark Dönüyor...' : 'Çarkı Çevir! 🎰'}
                </motion.button>
              )}

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="mb-4">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold mb-2">Tebrikler!</h3>
                      <p className="text-xl text-gray-600 mb-4">
                        <span className="font-bold text-purple-600">{result.label}</span> kazandın!
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition"
                    >
                      Harika! 🎊
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SpinWheel