import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, MousePointer, Eye, Activity } from 'lucide-react'
import API from '../../api/axiosConfig'
import toast from 'react-hot-toast'

function HeatmapViewer({ page }) {
  const [heatmapType, setHeatmapType] = useState('click')
  const [heatmapData, setHeatmapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [intensity, setIntensity] = useState(0.5)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetchHeatmapData()
  }, [page, heatmapType])

  useEffect(() => {
    if (heatmapData && canvasRef.current) {
      renderHeatmap()
    }
  }, [heatmapData, intensity])

  const fetchHeatmapData = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/analytics/heatmap/${page}/${heatmapType}`)
      setHeatmapData(response.data.heatmap)
    } catch (error) {
      toast.error('Heatmap yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const renderHeatmap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw heatmap points
    heatmapData.dataPoints.forEach(point => {
      const radius = 30
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      )

      // Color based on intensity
      const alpha = Math.min(point.value * intensity, 1)
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`)
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${alpha * 0.5})`)
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2
      )
    })

    // Draw hotspots (top areas)
    heatmapData.hotspots.slice(0, 5).forEach((hotspot, index) => {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.strokeRect(hotspot.x, hotspot.y, 50, 50)

      // Label
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`${index + 1}`, hotspot.x + 20, hotspot.y + 30)
    })
  }

  const heatmapTypes = [
    { id: 'click', label: 'Tıklamalar', icon: MousePointer, color: 'from-red-600 to-orange-600' },
    { id: 'move', label: 'Mouse Hareketleri', icon: Activity, color: 'from-blue-600 to-cyan-600' },
    { id: 'scroll', label: 'Scroll Derinliği', icon: TrendingUp, color: 'from-green-600 to-emerald-600' },
    { id: 'attention', label: 'Dikkat Alanları', icon: Eye, color: 'from-purple-600 to-pink-600' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!heatmapData || heatmapData.dataPoints.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Henüz heatmap verisi yok
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex gap-3 overflow-x-auto">
        {heatmapTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => setHeatmapType(type.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                heatmapType === type.id
                  ? `bg-gradient-to-r ${type.color} text-white`
                  : 'bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border hover:border-gray-300'
              }`}
            >
              <Icon size={20} />
              {type.label}
            </button>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Toplam Tıklama
          </p>
          <p className="text-2xl font-bold dark:text-dark-text">
            {heatmapData.stats.totalClicks.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Toplam Oturum
          </p>
          <p className="text-2xl font-bold dark:text-dark-text">
            {heatmapData.stats.totalSessions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Data Noktası
          </p>
          <p className="text-2xl font-bold dark:text-dark-text">
            {heatmapData.dataPoints.length.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Intensity Control */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold dark:text-dark-text">
            Yoğunluk
          </label>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Heatmap Canvas */}
      <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={2000}
          className="w-full h-auto"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Overlay - Screenshot of actual page should be here */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <iframe
            src={`${window.location.origin}${heatmapData.url}`}
            className="w-full h-full border-0"
            style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
          />
        </div>
      </div>

      {/* Top Hotspots */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-4 dark:text-dark-text">
          En Popüler Alanlar
        </h3>
        <div className="space-y-3">
          {heatmapData.hotspots.slice(0, 5).map((hotspot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-dark-hover rounded-lg"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold dark:text-dark-text">
                  Position: ({hotspot.x}, {hotspot.y})
                </p>
                {hotspot.element && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Element: {hotspot.element}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(hotspot.intensity)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  intensity
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeatmapViewer