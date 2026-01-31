import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axiosConfig'
import useAuthStore from '../../store/authStore'

function SocialLogin() {
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Google OAuth Demo/Integration
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      
      // Option 1: Redirect to Google OAuth (uncomment when configured)
      // const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      // const redirectUri = `${window.location.origin}/auth/google/callback`
      // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`

      // Option 2: Demo login for testing
      const response = await API.post('/auth/social-login', {
        provider: 'google',
        uid: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'google.user@gmail.com',
        name: 'Google Kullanıcı',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      })

      if (response.data.token) {
        setToken(response.data.token)
        setUser(response.data.user)
        navigate('/')
      }
    } catch (error) {
      console.error('Google login error:', error)
      alert('Google ile giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setLoading(true)

      // Option 1: Redirect to Facebook OAuth (uncomment when configured)
      // const appId = import.meta.env.VITE_FACEBOOK_APP_ID
      // const redirectUri = `${window.location.origin}/auth/facebook/callback`
      // window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email,public_profile`

      // Option 2: Demo login for testing
      const response = await API.post('/auth/social-login', {
        provider: 'facebook',
        uid: 'facebook_' + Math.random().toString(36).substr(2, 9),
        email: 'facebook.user@facebook.com',
        name: 'Facebook Kullanıcı',
        avatar: 'https://platform-lookaside.fbsbx.com/platform/profilepic/test/test.jpg'
      })

      if (response.data.token) {
        setToken(response.data.token)
        setUser(response.data.user)
        navigate('/')
      }
    } catch (error) {
      console.error('Facebook login error:', error)
      alert('Facebook ile giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleLogin = async () => {
    try {
      setLoading(true)

      // Demo Apple login for testing
      const response = await API.post('/auth/social-login', {
        provider: 'apple',
        uid: 'apple_' + Math.random().toString(36).substr(2, 9),
        email: 'apple.user@icloud.com',
        name: 'Apple Kullanıcı',
        avatar: 'https://www.apple.com/favicon.ico'
      })

      if (response.data.token) {
        setToken(response.data.token)
        setUser(response.data.user)
        navigate('/')
      }
    } catch (error) {
      console.error('Apple login error:', error)
      alert('Apple ile giriş başarısız')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">veya</span>
        </div>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google ile Giriş Yap
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebookLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook ile Giriş Yap
      </button>

      {/* Apple */}
      <button
        onClick={handleAppleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 13.5c-.91 0-1.82.55-2.25 1.51.37.77 1.2 1.29 2.25 1.29 1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z"/>
          <path d="M17.05 9c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        Apple ile Giriş Yap
      </button>
    </div>
  )
}

export default SocialLogin