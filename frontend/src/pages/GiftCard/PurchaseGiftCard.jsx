import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Copy, Check, AlertCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import API from '../../api/axiosConfig'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

function PurchaseGiftCard() {
  const { isAuthenticated, user } = useAuthStore()
  const [formData, setFormData] = useState({
    value: 500,
    recipientEmail: '',
    recipientName: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)

  const amounts = [50, 100, 250, 500, 1000, 2500, 5000]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }))
    setError('')
  }

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      value: amount
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isAuthenticated) {
        setError('Lütfen giriş yapın')
        setLoading(false)
        return
      }

      if (!formData.recipientEmail) {
        setError('Lütfen alıcı e-postasını girin')
        setLoading(false)
        return
      }

      if (!formData.recipientName) {
        setError('Lütfen alıcı adını girin')
        setLoading(false)
        return
      }

      const response = await API.post('/gift-cards/purchase', {
        value: formData.value,
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        message: formData.message
      })

      setSuccess(response.data.data)
      setFormData({
        value: 500,
        recipientEmail: '',
        recipientName: '',
        message: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem başarısız oldu')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(success.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        {!success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                <Gift size={32} className="text-purple-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 dark:text-dark-text">
              Hediye Kartı Satın Al
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Sevdiklerinize hediye kartı gönderin
            </p>

            {!isAuthenticated ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-200">
                    Giriş yapmanız gerekli
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Hediye kartı satın almak için lütfen hesabınıza giriş yapın
                  </p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold mb-4 dark:text-dark-text">
                  Tutarı Seçin
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {amounts.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg font-semibold transition ${
                        formData.value === amount
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'border-2 border-gray-300 dark:border-dark-border hover:border-purple-400 dark:text-dark-text'
                      }`}
                    >
                      ₺{amount}
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seçili Tutar: <span className="font-bold text-lg text-purple-600">₺{formData.value}</span>
                  </p>
                </div>
              </div>

              {/* Recipient Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                  Alıcı E-postası
                </label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="alici@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-purple-600 dark:bg-dark-hover dark:text-dark-text"
                  required
                />
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                  Alıcı Adı
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Alıcı adı"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-purple-600 dark:bg-dark-hover dark:text-dark-text"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-dark-text">
                  Mesaj (İsteğe Bağlı)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hediye kartı mesajınız..."
                  rows="4"
                  maxLength={200}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-purple-600 dark:bg-dark-hover dark:text-dark-text resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.message.length}/200 karakter
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'İşleniyor...' : <>
                  <Gift size={20} />
                  Hediye Kartı Satın Al
                </>}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3">
                Hediye Kartı Hakkında
              </h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Hediye kartları 50₺ ile 5000₺ arasında seçilebilir</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Hediye kartı kodu alıcıya e-mail ile gönderilir</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Hediye kartları 1 yıl boyunca geçerlidir</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Kişiye özel mesaj ekleyebilirsiniz</span>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6"
            >
              <Check size={40} className="text-green-600" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-2 dark:text-dark-text">
              Tebrikler! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Hediye kartınız başarıyla oluşturuldu
            </p>

            {/* Gift Card Code */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Hediye Kartı Kodu
              </p>
              <div className="flex items-center justify-between gap-4 bg-white dark:bg-dark-hover rounded-lg p-4 mb-2">
                <code className="text-2xl font-bold text-purple-600 tracking-widest">
                  {success.code}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-green-600" />
                      <span className="text-sm text-green-600">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} className="text-gray-600" />
                      <span className="text-sm text-gray-600">Kopyala</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kodu kopyalayıp alıcıya gönderebilirsiniz
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-8 text-left bg-gray-50 dark:bg-dark-hover rounded-lg p-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tutar:</span>
                <span className="font-bold dark:text-dark-text">₺{success.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Alıcı:</span>
                <span className="font-bold dark:text-dark-text">{success.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">E-posta:</span>
                <span className="font-bold dark:text-dark-text">{success.recipientEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Geçerlilik:</span>
                <span className="font-bold dark:text-dark-text">1 yıl</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSuccess(null)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition"
              >
                Başka Hediye Kartı Satın Al
              </button>
              <a
                href="/"
                className="w-full py-3 border-2 border-gray-300 dark:border-dark-border rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-dark-hover transition dark:text-dark-text"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default PurchaseGiftCard
