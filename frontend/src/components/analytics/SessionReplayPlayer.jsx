import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward,
  MousePointer, AlertCircle, ShoppingCart
} from 'lucide-react'
import API from '../../api/axiosConfig'

function SessionReplayPlayer({ sessionId }) {
  const [replay, setReplay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  const intervalRef = useRef(null)

  useEffect(() => {
    fetchReplay()
  }, [sessionId])

  useEffect(() => {
    if (playing && replay) {
      playSession()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [playing, playbackSpeed])

  const fetchReplay = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/analytics/session/${sessionId}`)
      setReplay(response.data.replay)
    } catch (error) {
      console.error('Fetch replay error:', error)
    } finally {
      setLoading(false)
    }
  }

  const playSession = () => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (100 * playbackSpeed)
        
        // Update current event
        const eventIndex = replay.events.findIndex(e => e.timestamp > next)
        if (eventIndex !== -1) {
          setCurrentEventIndex(eventIndex)
        }

        // Check if finished
        if (next >= replay.duration * 1000) {
          setPlaying(false)
          return 0
        }

        return next
      })
    }, 100)
  }

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleRestart = () => {
    setCurrentTime(0)
    setCurrentEventIndex(0)
    setPlaying(true)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 5000))
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(replay.duration * 1000, currentTime + 5000))
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    setCurrentTime(percentage * replay.duration * 1000)
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!replay) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Session bulunamadı
        </p>
      </div>
    )
  }

  const currentEvent = replay.events[currentEventIndex]
  const progress = (currentTime / (replay.duration * 1000)) * 100

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 dark:text-dark-text">
              Session: {replay.sessionId}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>👤 {replay.user?.name || 'Misafir'}</span>
              <span>⏱️ {Math.floor(replay.duration / 60)} dakika</span>
              <span>📄 {replay.pages.length} sayfa</span>
              <span>🎬 {replay.events.length} event</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2">
            {replay.converted && (
              <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                ✅ Converted
              </div>
            )}
            {replay.hasRageClicks && (
              <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                😤 Rage Clicks
              </div>
            )}
            {replay.hasErrors && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold">
                ⚠️ Errors
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl overflow-hidden">
        {/* Screen */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
          {/* Simulated screen - In production, render actual DOM */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MousePointer size={48} className="mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-semibold dark:text-dark-text">
                Event #{currentEventIndex + 1}
              </p>
              {currentEvent && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {currentEvent.type}: {currentEvent.target?.element}
                </p>
              )}
            </div>
          </div>

          {/* Current Event Indicator */}
          {currentEvent && currentEvent.position && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl"
              style={{
                left: `${(currentEvent.position.x / 1920) * 100}%`,
                top: `${(currentEvent.position.y / 1080) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-6 border-t dark:border-dark-border">
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            className="mb-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
          >
            <div
              className="absolute h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            
            {/* Event Markers */}
            {replay.events.map((event, index) => {
              const position = (event.timestamp / (replay.duration * 1000)) * 100
              const isImportant = ['click', 'error', 'conversion'].includes(event.type)
              
              return (
                <div
                  key={index}
                  className={`absolute top-0 w-1 h-full ${
                    isImportant ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ left: `${position}%` }}
                />
              )
            })}
          </div>

          {/* Time */}
          <div className="flex justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(replay.duration * 1000)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="p-3 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={handleSkipBack}
              className="p-3 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={handleSkipForward}
              className="p-3 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition"
            >
              <SkipForward size={20} />
            </button>

            {/* Speed Selector */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="px-3 py-2 border-2 border-gray-200 dark:border-dark-border rounded-lg dark:bg-dark-card dark:text-dark-text"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-4 dark:text-dark-text">
          Event Timeline
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {replay.events.map((event, index) => {
            const Icon = getEventIcon(event.type)
            const isActive = index === currentEventIndex

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border'
                }`}
                onClick={() => {
                  setCurrentTime(event.timestamp)
                  setCurrentEventIndex(index)
                }}
              >
                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-600'} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'dark:text-dark-text'}`}>
                    {event.type}
                  </p>
                  {event.target?.element && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.target.element}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(event.timestamp)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Errors */}
      {replay.errors && replay.errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
            <AlertCircle size={24} />
            Errors
          </h3>
          <div className="space-y-2">
            {replay.errors.map((error, index) => (
              <div key={index} className="p-3 bg-white dark:bg-dark-card rounded-lg">
                <p className="font-semibold text-red-600">{error.message}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatTime(error.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const getEventIcon = (type) => {
  switch (type) {
    case 'click': return MousePointer
    case 'error': return AlertCircle
    case 'conversion': return ShoppingCart
    default: return MousePointer
  }
}

export default SessionReplayPlayer
