import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Hata mesajını temizle
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
    setGeneralError('')
  }



  const validateForm = () => {
    const newErrors = {}

    // Ad Soyad validasyonu
    if (!formData.name.trim()) {
      newErrors.name = '👤 Ad soyad alanı boş olamaz'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = '👤 Ad soyad en az 3 karakter olmalıdır'
    }

    // E-posta validasyonu
    if (!formData.email.trim()) {
      newErrors.email = '📧 E-posta alanı boş olamaz'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '📧 Geçerli bir e-posta adresi girin'
    }

    // Şifre validasyonu
    if (!formData.password) {
      newErrors.password = '🔐 Şifre alanı boş olamaz'
    } else if (formData.password.length < 6) {
      newErrors.password = '🔐 Şifre en az 6 karakter olmalıdır'
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = '🔐 Şifre en az 1 büyük harf ve 1 rakam içermelidir'
    }

    // Şifre Tekrar validasyonu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '🔐 Şifre tekrar alanı boş olamaz'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '🔐 Şifreler eşleşmiyor'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    
    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      const result = await register(formData)
      setLoading(false)

      console.log('Register Result:', result)

      if (result?.success) {
        navigate('/')
      } else if (result?.error) {
        setGeneralError(result.error)
      } else {
        setGeneralError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      setLoading(false)
      console.error('Register Exception:', err)
      setGeneralError(err?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    }
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
          <h2 className="text-3xl font-bold text-center mb-2">Hesap Oluştur</h2>
          <p className="text-gray-600 text-center mb-8">
            Hemen ücretsiz hesap açın ve alışverişe başlayın
          </p>

          {/* Genel Hata Mesajı */}
          {generalError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <span>Ad Soyad</span>
                {formData.name && !errors.name && <CheckCircle size={16} className="text-green-500" />}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız ve soyadınız"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* E-posta */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <span>E-posta</span>
                {formData.email && !errors.email && <CheckCircle size={16} className="text-green-500" />}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-semibold mb-2">Telefon (Opsiyonel)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XX XXX XX XX"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <span>Şifre</span>
                {formData.password && !errors.password && <CheckCircle size={16} className="text-green-500" />}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="En az 6 karakter (büyük harf + rakam)"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <span>Şifre Tekrar</span>
                {formData.confirmPassword && !errors.confirmPassword && <CheckCircle size={16} className="text-green-500" />}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifrenizi tekrar girin"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Kullanım Şartları */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 accent-blue-600"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <Link to="/terms" className="text-blue-600 hover:underline">Kullanım Şartları</Link>
                {' ve '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikası</Link>
                'nı okudum ve kabul ediyorum.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>



          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="block text-center text-gray-600 hover:text-gray-900 mt-6"
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage