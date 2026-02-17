import { motion } from 'framer-motion'
import { TrendingDown, Users, Clock, Target } from 'lucide-react'

function FunnelVisualization({ funnel, analytics }) {
  if (!analytics || !analytics.stepData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Henüz veri yok
        </p>
      </div>
    )
  }

  const maxEntered = Math.max(...analytics.stepData.map(s => s.entered))

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Sessions"
          value={analytics.totalSessions.toLocaleString()}
          color="from-blue-600 to-cyan-600"
        />
        <StatCard
          icon={Target}
          label="Completed"
          value={analytics.completedSessions.toLocaleString()}
          color="from-green-600 to-emerald-600"
        />
        <StatCard
          icon={TrendingDown}
          label="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(2)}%`}
          color="from-purple-600 to-pink-600"
        />
        <StatCard
          icon={Clock}
          label="Avg Time"
          value={formatTime(analytics.avgTimeToComplete)}
          color="from-orange-600 to-red-600"
        />
      </div>

      {/* Funnel Steps */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-8 dark:text-dark-text">
          Funnel Steps
        </h3>

        <div className="space-y-6">
          {funnel.steps.map((step, index) => {
            const stepData = analytics.stepData[index]
            if (!stepData) return null

            const width = (stepData.entered / maxEntered) * 100
            const completionRate = stepData.entered > 0
              ? (stepData.completed / stepData.entered) * 100
              : 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-dark-text">
                        {step.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.type === 'pageview' ? step.url : step.eventName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold dark:text-dark-text">
                      {stepData.entered.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      users
                    </p>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="relative">
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative"
                    >
                      {/* Completion Rate Bar */}
                      <div
                        className="absolute left-0 top-0 h-full bg-green-500 opacity-30"
                        style={{ width: `${completionRate}%` }}
                      />

                      {/* Text */}
                      <div className="relative z-10 text-white font-bold">
                        {completionRate.toFixed(1)}% completed
                      </div>
                    </motion.div>
                  </div>

                  {/* Drop-off Arrow */}
                  {index < funnel.steps.length - 1 && stepData.dropOff > 0 && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-0.5 bg-red-500" />
                        <div className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-bold">
                          -{stepData.dropOff}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Stats */}
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div className="text-center p-2 bg-gray-50 dark:bg-dark-hover rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Entered
                    </p>
                    <p className="font-bold dark:text-dark-text">
                      {stepData.entered}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-dark-hover rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="font-bold text-green-600">
                      {stepData.completed}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-dark-hover rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Drop-off
                    </p>
                    <p className="font-bold text-red-600">
                      {stepData.dropOff}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-dark-hover rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Avg Time
                    </p>
                    <p className="font-bold dark:text-dark-text">
                      {formatTime(stepData.avgTimeOnStep)}
                    </p>
                  </div>
                </div>

                {/* Drop-off Rate Badge */}
                {stepData.dropOffRate > 0 && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
                    {stepData.dropOffRate.toFixed(1)}% drop-off
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1 dark:text-dark-text">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  )
}

const formatTime = (seconds) => {
  if (!seconds) return '0s'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

export default FunnelVisualization