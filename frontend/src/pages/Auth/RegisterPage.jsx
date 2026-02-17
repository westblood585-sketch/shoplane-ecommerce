import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMetaDescription, metaDescriptions } from '../../utils/metaDescriptions'
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'

function RegisterPage() {
  // Set optimized meta description for SEO
  useMetaDescription(metaDescriptions.register.description, metaDescriptions.register.title)
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      backgroundImage: `url('/neon-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: '#0a0a0a'
    }}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 z-0" />
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-4xl font-bold text-white">MyShop</h1>
        </Link>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">Hesap Oluştur</h2>
          <p className="text-white/70 text-center mb-8">
            Hemen ücretsiz hesap açın ve alışverişe başlayın
          </p>

          {/* Genel Hata Mesajı */}
          {generalError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                <span>Ad Soyad</span>
                {formData.name && !errors.name && <CheckCircle size={16} className="text-green-400" />}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-white/40" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız ve soyadınız"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition bg-white/5 text-white placeholder:text-white/30 ${
                    errors.name
                      ? 'border-red-500/50 focus:border-red-500 bg-red-500/10'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* E-posta */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                <span>E-posta</span>
                {formData.email && !errors.email && <CheckCircle size={16} className="text-green-400" />}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-white/40" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition bg-white/5 text-white placeholder:text-white/30 ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500 bg-red-500/10'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Telefon (Opsiyonel)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-white/40" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XX XXX XX XX"
                  className="w-full pl-10 pr-4 py-3 border-2 border-white/20 rounded-lg focus:outline-none focus:border-white/40 bg-white/5 text-white placeholder:text-white/30 transition"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                <span>Şifre</span>
                {formData.password && !errors.password && <CheckCircle size={16} className="text-green-400" />}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/40" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="En az 6 karakter (büyük harf + rakam)"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition bg-white/5 text-white placeholder:text-white/30 ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500 bg-red-500/10'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                <span>Şifre Tekrar</span>
                {formData.confirmPassword && !errors.confirmPassword && <CheckCircle size={16} className="text-green-400" />}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/40" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifrenizi tekrar girin"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition bg-white/5 text-white placeholder:text-white/30 ${
                    errors.confirmPassword
                      ? 'border-red-500/50 focus:border-red-500 bg-red-500/10'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm mt-2 flex items-center gap-1">
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
                className="w-4 h-4 mt-1 accent-white"
                required
              />
              <label htmlFor="terms" className="text-sm text-white/70">
                <Link to="/terms" className="text-white/90 hover:text-white hover:underline">Kullanım Şartları</Link>
                {' ve '}
                <Link to="/privacy" className="text-white/90 hover:text-white hover:underline">Gizlilik Politikası</Link>
                'nı okudum ve kabul ediyorum.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20"
            >
              {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>



          {/* Login Link */}
          <p className="text-center text-white/70 mt-6">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-white/90 font-semibold hover:text-white hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="block text-center text-white/70 hover:text-white mt-6 transition-colors"
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage