import API from '../api/axiosConfig'

// URL'den referral code'u al
export const getReferralCodeFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}

// Referral code'u localStorage'a kaydet
export const saveReferralCode = (code) => {
  if (code) {
    localStorage.setItem('referralCode', code)
    localStorage.setItem('referralCodeTimestamp', Date.now().toString())
  }
}

// Referral code'u al (30 gün geçerli)
export const getReferralCode = () => {
  const code = localStorage.getItem('referralCode')
  const timestamp = localStorage.getItem('referralCodeTimestamp')
  
  if (!code || !timestamp) return null
  
  // 30 gün = 30 * 24 * 60 * 60 * 1000
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  const now = Date.now()
  
  if (now - parseInt(timestamp) > thirtyDays) {
    localStorage.removeItem('referralCode')
    localStorage.removeItem('referralCodeTimestamp')
    return null
  }
  
  return code
}

// Referral tıklamasını track et
export const trackReferralClick = async (code) => {
  try {
    await API.post('/influencers/track-click', {
      referralCode: code
    })
  } catch (error) {
    console.error('Referral tracking error:', error)
  }
}

// Initialize referral tracking (App.jsx'te çağrılacak)
export const initializeReferralTracking = () => {
  const code = getReferralCodeFromURL()
  
  if (code) {
    saveReferralCode(code)
    trackReferralClick(code)
    
    // URL'den ref parametresini temizle
    const url = new URL(window.location.href)
    url.searchParams.delete('ref')
    window.history.replaceState({}, '', url.toString())
  }
}