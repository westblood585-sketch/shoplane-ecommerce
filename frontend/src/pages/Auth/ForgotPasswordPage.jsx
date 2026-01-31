import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import useAuthStore from '../../store/authStore'

function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Lütfen e-posta adresinizi girin')
      return
    }

    setLoading(true)
    const result = await forgotPassword(email)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">E-posta Gönderildi!</h2>
            <p className="text-gray-600 mb-6">
              Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
              Lütfen e-postanızı kontrol edin.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">MyShop</h1>
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Şifremi Unuttum</h2>
          <p className="text-gray-600 text-center mb-8">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
        </button>
      </form>

      {/* Back to Login */}
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6"
      >
        <ArrowLeft size={20} />
        Giriş Sayfasına Dön
      </Link>
    </div>
  </div>
</div>
) }
export default ForgotPasswordPage