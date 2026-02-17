import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocation } from 'react-router-dom'
import API from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export const useAnalytics = () => {
  const location = useLocation()
  const { user } = useAuthStore()
  const sessionIdRef = useRef(null)
  const eventBufferRef = useRef([])
  const lastScrollRef = useRef(0)

  useEffect(() => {
    initializeSession()
    setupEventListeners()

    return () => {
      endSession()
    }
  }, [])

  useEffect(() => {
    trackPageView()
  }, [location.pathname])

  const initializeSession = async () => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('analyticsSessionId')
    if (!sessionId) {
      sessionId = uuidv4()
      sessionStorage.setItem('analyticsSessionId', sessionId)
    }
    sessionIdRef.current = sessionId

    // Get anonymous ID
    let anonymousId = localStorage.getItem('anonymousId')
    if (!anonymousId) {
      anonymousId = uuidv4()
      localStorage.setItem('anonymousId', anonymousId)
    }

    // Start session recording
    try {
      await API.post('/analytics/session/start', {
        sessionId,
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          deviceType: getDeviceType(),
          browser: getBrowserName(),
          os: getOS()
        }
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      console.error('Analytics init error:', error)
    }
  }

  const setupEventListeners = () => {
    // Click tracking
    document.addEventListener('click', handleClick, true)

    // Scroll tracking (throttled)
    let scrollTimeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        trackScroll()
      }, 200)
    }
    window.addEventListener('scroll', handleScroll)

    // Mouse move tracking (throttled, for heatmap)
    let moveTimeout
    const handleMouseMove = (e) => {
      clearTimeout(moveTimeout)
      moveTimeout = setTimeout(() => {
        trackMouseMove(e)
      }, 500)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Input tracking (debounced)
    let inputTimeout
    const handleInput = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        clearTimeout(inputTimeout)
        inputTimeout = setTimeout(() => {
          trackInput(e)
        }, 1000)
      }
    }
    document.addEventListener('input', handleInput, true)

    // Error tracking
    window.addEventListener('error', handleError)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('input', handleInput, true)
      window.removeEventListener('error', handleError)
    }
  }

  const handleClick = (e) => {
    const element = e.target
    const rect = element.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY + window.scrollY

    // Track click for heatmap
    trackHeatmapData('click', x, y, 1, getCSSSelector(element))

    // Track click event for session
    trackEvent({
      type: 'click',
      target: {
        element: getCSSSelector(element),
        text: element.textContent?.substring(0, 50),
        attributes: {
          id: element.id,
          className: element.className,
          tagName: element.tagName
        }
      },
      position: {
        x: e.clientX,
        y: e.clientY,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      }
    })
  }

  const trackScroll = () => {
    const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    
    // Only track significant scroll changes
    if (Math.abs(scrollDepth - lastScrollRef.current) > 5) {
      lastScrollRef.current = scrollDepth

      trackHeatmapData('scroll', 0, window.scrollY, scrollDepth)

      trackEvent({
        type: 'scroll',
        position: {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        },
        value: scrollDepth
      })
    }
  }

  const trackMouseMove = (e) => {
    const x = e.clientX
    const y = e.clientY + window.scrollY

    // Track for attention heatmap
    trackHeatmapData('move', x, y, 1)
  }

  const trackInput = (e) => {
    const element = e.target

    trackEvent({
      type: 'input',
      target: {
        element: getCSSSelector(element),
        attributes: {
          type: element.type,
          name: element.name
        }
      },
      // Don't track actual values for privacy
      value: element.value ? '***MASKED***' : ''
    })
  }

  const handleError = (e) => {
    trackEvent({
      type: 'error',
      value: {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      }
    })
  }

  const trackPageView = () => {
    trackEvent({
      type: 'navigation',
      url: location.pathname + location.search
    })
  }

  const trackHeatmapData = async (type, x, y, value, element = null) => {
    try {
      const anonymousId = localStorage.getItem('anonymousId')
      const page = getPageName(location.pathname)

      await API.post('/analytics/heatmap', {
        page,
        url: location.pathname,
        type,
        x,
        y,
        value,
        element,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        sessionId: sessionIdRef.current
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      // Silent fail for tracking
    }
  }

  const trackEvent = async (event) => {
    try {
      // Add timestamp relative to session start
      const timestamp = Date.now()

      await API.post('/analytics/session/event', {
        sessionId: sessionIdRef.current,
        event: {
          ...event,
          timestamp,
          url: location.pathname
        }
      })
    } catch (error) {
      // Silent fail
    }
  }

  const trackConversion = async (value = 0) => {
    try {
      await API.post('/analytics/session/end', {
        sessionId: sessionIdRef.current,
        converted: true,
        conversionValue: value
      })

      // Start new session
      sessionStorage.removeItem('analyticsSessionId')
      initializeSession()
    } catch (error) {
      console.error('Track conversion error:', error)
    }
  }

  const endSession = async () => {
    try {
      if (sessionIdRef.current) {
        await API.post('/analytics/session/end', {
          sessionId: sessionIdRef.current,
          converted: false
        })
      }
    } catch (error) {
      // Silent fail
    }
  }

  // Helper functions
  const getCSSSelector = (element) => {
    if (element.id) return `#${element.id}`
    if (element.className) {
      const classes = String(element.className).split(' ').filter(c => c).join('.')
      return `.${classes}`
    }
    return element.tagName.toLowerCase()
  }

  const getPageName = (pathname) => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/products/')) return 'product'
    if (pathname === '/cart') return 'cart'
    if (pathname === '/checkout') return 'checkout'
    return pathname.replace(/\//g, '_')
  }

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

  const getOS = () => {
    const ua = navigator.userAgent
    if (ua.includes('Win')) return 'Windows'
    if (ua.includes('Mac')) return 'MacOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS')) return 'iOS'
    return 'Other'
  }

  return {
    trackConversion
  }
}