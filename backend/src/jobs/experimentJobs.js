const cron = require('node-cron')
const Experiment = require('../models/Experiment')
const experimentService = require('../services/experimentService')

// Her gün saat 03:00'da running experiments'ı kontrol et
const checkExperimentResults = () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      console.log('🧪 Checking experiment results...')

      const experiments = await Experiment.find({
        status: 'running',
        'settings.autoSelectWinner': true
      })

      for (const experiment of experiments) {
        try {
          // Minimum sample size kontrolü
          const totalImpressions = experiment.variants.reduce(
            (sum, v) => sum + v.stats.impressions, 
            0
          )

          if (experiment.settings.sampleSize && totalImpressions < experiment.settings.sampleSize) {
            console.log(`⏳ Experiment ${experiment.name} - Insufficient data (${totalImpressions}/${experiment.settings.sampleSize})`)
            continue
          }

          // Auto-select winner
          await experimentService.autoSelectWinner(experiment._id)
        } catch (error) {
          console.error(`Error processing experiment ${experiment._id}:`, error)
        }
      }

      console.log('✅ Experiment results checked')
    } catch (error) {
      console.error('Check experiments error:', error)
    }
  })
}

// Expired experiments'ı otomatik kapat
const closeExpiredExperiments = () => {
  cron.schedule('0 4 * * *', async () => {
    try {
      console.log('🧪 Closing expired experiments...')

      const now = new Date()

      const expiredExperiments = await Experiment.find({
        status: 'running',
        endDate: { $lt: now }
      })

      for (const experiment of expiredExperiments) {
        experiment.status = 'completed'
        experiment.results = {
          ...experiment.results,
          completedAt: Date.now(),
          notes: 'Automatically closed (end date reached)'
        }
        await experiment.save()

        console.log(`✅ Closed experiment: ${experiment.name}`)
      }

      console.log(`✅ Closed ${expiredExperiments.length} expired experiments`)
    } catch (error) {
      console.error('Close expired experiments error:', error)
    }
  })
}

// Tüm jobları başlat
const startExperimentJobs = () => {
  console.log('🧪 Experiment jobs started!')
  checkExperimentResults()
  closeExpiredExperiments()
}

module.exports = { startExperimentJobs }