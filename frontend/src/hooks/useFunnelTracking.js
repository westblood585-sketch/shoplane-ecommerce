import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import API from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export const useFunnelTracking = (funnelId, steps) => {
  const location = useLocation()
  const { user } = useAuthStore()
  const sessionIdRef = useRef(null)
  const startedRef = useRef(false)
  const validRef = useRef(true) // Track if funnel is valid

  useEffect(() => {
    // Skip if funnel ID is not set or already failed
    if (funnelId && !startedRef.current && validRef.current) {
      startFunnelTracking()
      startedRef.current = true
    }
  }, [funnelId])

  useEffect(() => {
    if (startedRef.current && validRef.current) {
      checkStepCompletion()
    }
  }, [location.pathname])

  const startFunnelTracking = async () => {
    try {
      // Get or create session ID
      let sessionId = sessionStorage.getItem('funnelSessionId')
      if (!sessionId) {
        sessionId = uuidv4()
        sessionStorage.setItem('funnelSessionId', sessionId)
      }
      sessionIdRef.current = sessionId

      const anonymousId = localStorage.getItem('anonymousId')

      await API.post(`/funnels/${funnelId}/start`, {
        deviceInfo: {
          device: getDeviceType(),
          browser: getBrowserName(),
          source: document.referrer,
          utmParams: getUtmParams()
        }
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId,
          'X-Session-Id': sessionId
        }
      })
    } catch (error) {
      if (error.response?.status === 404) {
        // Funnel doesn't exist - disable tracking silently
        console.warn(`Funnel '${funnelId}' not found. Tracking disabled.`)
        validRef.current = false
      } else {
        console.error('Start funnel tracking error:', error)
      }
    }
  }

  const checkStepCompletion = () => {
    // Check if current page matches any step
    const stepIndex = steps.findIndex(step => {
      if (step.type === 'pageview') {
        if (step.urlPattern) {
          const regex = new RegExp(step.urlPattern)
          return regex.test(location.pathname)
        }
        return location.pathname === step.url
      }
      return false
    })

    if (stepIndex !== -1) {
      trackStep(stepIndex)
    }
  }

  const trackStep = async (stepIndex, metadata = null) => {
    try {
      if (!validRef.current) return // Skip if funnel is invalid
      
      const anonymousId = localStorage.getItem('anonymousId')

      await API.post(`/funnels/${funnelId}/step/${stepIndex}`, {
        metadata
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      if (error.response?.status === 404) {
        // Funnel doesn't exist - disable tracking silently
        validRef.current = false
      } else {
        console.error('Track step error:', error)
      }
    }
  }

  const trackEvent = async (eventName, properties = null) => {
    if (!validRef.current) return // Skip if funnel is invalid
    
    // Find step with matching event
    const stepIndex = steps.findIndex(step => 
      step.type === 'event' && step.eventName === eventName
    )

    if (stepIndex !== -1) {
      await trackStep(stepIndex, properties)
    }
  }

  // Helper functions
  const getDeviceType = () => {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  const getBrowserName = () => {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Other'
  }

  const getUtmParams = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content')
    }
  }

  return {
    trackStep,
    trackEvent
  }
}