import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import API from '../api/axiosConfig'

export const useJourneyTracking = () => {
  const location = useLocation()

  useEffect(() => {
    trackPageVisit()
  }, [location.pathname])

  const trackPageVisit = async () => {
    try {
      const anonymousId = localStorage.getItem('anonymousId')

      await API.post('/journeys/track', {
        type: 'visit',
        channel: 'web',
        page: location.pathname
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      // Silent fail
    }
  }

  const trackTouchpoint = async (type, data = {}) => {
    try {
      const anonymousId = localStorage.getItem('anonymousId')

      await API.post('/journeys/track', {
        type,
        channel: 'web',
        page: location.pathname,
        ...data
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      // Silent fail
    }
  }

  return {
    trackTouchpoint
  }
}