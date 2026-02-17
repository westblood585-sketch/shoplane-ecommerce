import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import API from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export const useABTest = (page = 'all') => {
  const { user } = useAuthStore()
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiments()
  }, [page])

  const loadExperiments = async () => {
    try {
      setLoading(true)
      
      // Get or create anonymous ID
      let anonymousId = localStorage.getItem('anonymousId')
      if (!anonymousId) {
        anonymousId = uuidv4()
        localStorage.setItem('anonymousId', anonymousId)
      }

      const response = await API.get(`/experiments/active/${page}`, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })

      setExperiments(response.data.experiments)
    } catch (error) {
      console.error('Load experiments error:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackEvent = async (experimentId, eventType, metadata = null) => {
    try {
      const anonymousId = localStorage.getItem('anonymousId')

      await API.post('/experiments/track', {
        experimentId,
        eventType,
        metadata
      }, {
        headers: {
          'X-Anonymous-Id': anonymousId
        }
      })
    } catch (error) {
      console.error('Track event error:', error)
    }
  }

  const getVariant = (experimentName) => {
    const experiment = experiments.find(e => e.experimentName === experimentName)
    return experiment?.variant || 'control'
  }

  const getChanges = (experimentName) => {
    const experiment = experiments.find(e => e.experimentName === experimentName)
    return experiment?.changes || {}
  }

  const trackConversion = (experimentId, value = 0) => {
    trackEvent(experimentId, 'conversion', { value })
  }

  const trackClick = (experimentId, element) => {
    trackEvent(experimentId, 'click', { element })
  }

  return {
    experiments,
    loading,
    getVariant,
    getChanges,
    trackConversion,
    trackClick,
    trackEvent
  }
}