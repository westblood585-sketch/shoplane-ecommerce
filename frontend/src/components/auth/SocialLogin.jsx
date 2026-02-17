import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import useAuthStore from '../../store/authStore'
import { toast } from 'react-hot-toast'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Sub-component for Real Google Login (Uses Hook)
// This must ONLY be rendered if GoogleOAuthProvider is present in the tree
const RealGoogleBtn = ({ onLoginSuccess, loading }) => {
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      onLoginSuccess(tokenResponse)
    },
    onError: () => toast.error('Google giriş iptal edildi')
  })

  return (
    <button
      type="button"
      onClick={() => loginGoogle()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Google ile Giriş Yap
    </button>
  )
}

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID

// Sub-component for Real Facebook Login
const RealFacebookBtn = ({ onLoginSuccess, loading }) => {
  // Initialize Facebook SDK
  if (!window.FB && FACEBOOK_APP_ID) {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error('Facebook SDK yüklenemedi')
      return
    }

    window.FB.login(function (response) {
      if (response.authResponse) {
        // Get User Info
        window.FB.api('/me', { fields: 'name, email, picture' }, function (userInfo) {
          onLoginSuccess({
            provider: 'facebook',
            uid: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture?.data?.url
          })
        });
      } else {
        toast.error('Facebook girişi iptal edildi')
      }
    }, { scope: 'public_profile,email' });
  }

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Facebook ile Giriş Yap
    </button>
  )
}

function SocialLogin() {
  const { socialLogin } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Unified Success Handler
  const handleSocialLoginResult = async (data) => {
    setLoading(true)
    try {
      const result = await socialLogin(data)

      if (result.success) {
        toast.success(`${data.provider.charAt(0).toUpperCase() + data.provider.slice(1)} ile giriş başarılı!`)
        navigate('/')
      } else {
        toast.error(result.error || 'Giriş başarısız')
      }
    } catch (error) {
      console.error('Social login error:', error)
      toast.error('Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  // Real Google Logic (Passed to sub-component)
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true)
    try {
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      }).then(res => res.json())

      await handleSocialLoginResult({
        provider: 'google',
        uid: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture
      })
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google ile giriş yapılamadı')
      setLoading(false) // Ensure loading is reset even if handleSocialLoginResult isn't called
    }
  }

  // Mock Login for others & Google fallback
  const handleMockLogin = async (provider) => {
    const config = {
      google: {
        uid: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'demo.google@example.com',
        name: 'Google Demo User',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      },
      facebook: {
        uid: 'facebook_' + Math.random().toString(36).substr(2, 9),
        email: 'demo.facebook@example.com',
        name: 'Facebook Demo User',
        avatar: 'https://platform-lookaside.fbsbx.com/platform/profilepic/test/test.jpg'
      },
      apple: {
        uid: 'apple_' + Math.random().toString(36).substr(2, 9),
        email: 'demo.apple@example.com',
        name: 'Apple Demo User',
        avatar: 'https://www.apple.com/favicon.ico'
      }
    }

    await handleSocialLoginResult({
      provider,
      ...config[provider]
    })
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

      {/* Google Button: Render Real or Mock based on Env */}
      {GOOGLE_CLIENT_ID ? (
        <RealGoogleBtn onLoginSuccess={handleGoogleSuccess} loading={loading} />
      ) : (
        <button
          type="button"
          onClick={() => handleMockLogin('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google ile Giriş Yap
        </button>
      )}

      {/* Facebook: Real or Mock */}
      {FACEBOOK_APP_ID ? (
        <RealFacebookBtn onLoginSuccess={handleSocialLoginResult} loading={loading} />
      ) : (
        <button
          type="button"
          onClick={() => handleMockLogin('facebook')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook ile Giriş Yap
        </button>
      )}

      {/* Apple - Demo */}
      <button
        type="button"
        onClick={() => handleMockLogin('apple')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 13.5c-.91 0-1.82.55-2.25 1.51.37.77 1.2 1.29 2.25 1.29 1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" />
          <path d="M17.05 9c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
        Apple ile Giriş Yap
      </button>

      <p className="text-xs text-center text-gray-400 mt-2">
        {GOOGLE_CLIENT_ID
          ? 'Not: Facebook ve Apple şimdilik demo modundadır.'
          : 'Not: Google, Facebook ve Apple demo modundadır (API Key eksik).'}
      </p>
    </div>
  )
}

export default SocialLogin