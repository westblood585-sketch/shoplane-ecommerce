import { motion } from 'framer-motion'
import { 
  Eye, Heart, ShoppingCart, CreditCard, 
  Star, MessageCircle, Share2, MapPin
} from 'lucide-react'

function JourneyVisualization({ journey }) {
  if (!journey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Journey verisi yok
        </p>
      </div>
    )
  }

  const stageColors = {
    awareness: 'from-blue-600 to-cyan-600',
    consideration: 'from-purple-600 to-pink-600',
    decision: 'from-orange-600 to-red-600',
    purchase: 'from-green-600 to-emerald-600',
    retention: 'from-yellow-600 to-orange-600',
    advocacy: 'from-indigo-600 to-purple-600'
  }

  const touchpointIcons = {
    visit: Eye,
    search: Eye,
    product_view: Eye,
    add_to_cart: ShoppingCart,
    wishlist_add: Heart,
    review_read: Star,
    checkout_start: CreditCard,
    purchase: CreditCard,
    review_submit: MessageCircle,
    share: Share2
  }

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <div className="space-y-8">
      {/* Journey Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Current Stage
          </p>
          <p className={`text-2xl font-bold bg-gradient-to-r ${stageColors[journey.currentStage]} bg-clip-text text-transparent`}>
            {journey.currentStage}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Touchpoints
          </p>
          <p className="text-2xl font-bold dark:text-dark-text">
            {journey.metrics.totalTouchpoints}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Engagement Score
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {journey.metrics.engagementScore}/100
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Purchase Intent
          </p>
          <p className="text-2xl font-bold text-green-600">
            {journey.metrics.purchaseIntent}/100
          </p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-8 dark:text-dark-text">
          Journey Timeline
        </h3>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-green-600" />

          {/* Stages */}
          <div className="space-y-12">
            {journey.stageTimeline.map((stage, stageIndex) => (
              <motion.div
                key={stageIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
                className="relative pl-20"
              >
                {/* Stage Icon */}
                <div className={`absolute left-0 w-16 h-16 bg-gradient-to-r ${stageColors[stage.name]} rounded-full flex items-center justify-center text-white font-bold shadow-xl`}>
                  <MapPin size={28} />
                </div>

                {/* Stage Content */}
                <div className="bg-gray-50 dark:bg-dark-hover rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold capitalize dark:text-dark-text">
                      {stage.name}
                    </h4>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="font-bold dark:text-dark-text">
                        {stage.duration ? formatDuration(stage.duration) : 'Active'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {new Date(stage.enteredAt).toLocaleString('tr-TR')}
                    {stage.exitedAt && ` - ${new Date(stage.exitedAt).toLocaleString('tr-TR')}`}
                  </p>

                  {/* Touchpoints in this stage */}
                  {stage.touchpoints.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold mb-2 dark:text-dark-text">
                        Touchpoints ({stage.touchpoints.length}):
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {stage.touchpoints.map((touchpoint, tIndex) => {
                          const Icon = touchpointIcons[touchpoint.type] || Eye

                          return (
                            <div
                              key={tIndex}
                              className="flex items-center gap-2 p-2 bg-white dark:bg-dark-card rounded-lg"
                            >
                              <Icon size={16} className="text-blue-600" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate dark:text-dark-text">
                                  {touchpoint.type.replace('_', ' ')}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {new Date(touchpoint.timestamp).toLocaleTimeString('tr-TR')}
                                </p>
                              </div>
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded text-xs">
                                {touchpoint.channel}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Mix */}
      {journey.metrics.channelMix.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-dark-text">
            Channel Distribution
          </h3>

          <div className="space-y-3">
            {journey.metrics.channelMix
              .sort((a, b) => b.percentage - a.percentage)
              .map((channel, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold capitalize dark:text-dark-text">
                      {channel.channel}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {channel.count} ({channel.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${channel.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* First & Last Touch Attribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 dark:text-dark-text">
            First Touch
          </h3>
          {journey.firstTouch && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Channel:</span>
                <span className="font-semibold capitalize dark:text-dark-text">
                  {journey.firstTouch.channel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Source:</span>
                <span className="font-semibold dark:text-dark-text">
                  {journey.firstTouch.source || 'Direct'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                <span className="text-sm dark:text-dark-text">
                  {new Date(journey.firstTouch.timestamp).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 dark:text-dark-text">
            Last Touch
          </h3>
          {journey.lastTouch && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Channel:</span>
                <span className="font-semibold capitalize dark:text-dark-text">
                  {journey.lastTouch.channel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Source:</span>
                <span className="font-semibold dark:text-dark-text">
                  {journey.lastTouch.source || 'Direct'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                <span className="text-sm dark:text-dark-text">
                  {new Date(journey.lastTouch.timestamp).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Status */}
      {journey.converted && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-1">
                ✅ Converted!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(journey.convertedAt).toLocaleString('tr-TR')}
              </p>
            </div>
            {journey.conversionValue && (
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {journey.conversionValue.toFixed(2)}₺
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Conversion Value
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default JourneyVisualization
