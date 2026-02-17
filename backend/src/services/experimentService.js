const Experiment = require('../models/Experiment')
const VariantAssignment = require('../models/VariantAssignment')

class ExperimentService {
  // Get active experiments for a page
  async getActiveExperiments(page = 'all', userId = null, anonymousId = null) {
    try {
      const experiments = await Experiment.find({
        status: 'running',
        $or: [
          { targetPage: page },
          { targetPage: 'all' }
        ]
      })

      const activeExperiments = []

      for (const experiment of experiments) {
        // Check if user already assigned
        const existing = await VariantAssignment.findOne({
          experiment: experiment._id,
          $or: [
            ...(userId ? [{ user: userId }] : []),
            ...(anonymousId ? [{ anonymousId }] : [])
          ]
        })

        if (existing) {
          activeExperiments.push({
            experimentId: experiment._id,
            experimentName: experiment.name,
            variant: existing.variant,
            changes: experiment.variants.find(v => v.name === existing.variant)?.changes
          })
        } else {
          // Assign new variant
          const variant = experiment.selectVariant()
          
          if (variant) {
            const assignment = await VariantAssignment.create({
              experiment: experiment._id,
              user: userId,
              anonymousId,
              variant: variant.name
            })

            activeExperiments.push({
              experimentId: experiment._id,
              experimentName: experiment.name,
              variant: variant.name,
              changes: variant.changes
            })

            // Track impression
            variant.stats.impressions += 1
            await experiment.save()
          }
        }
      }

      return activeExperiments
    } catch (error) {
      console.error('Get experiments error:', error)
      return []
    }
  }

  // Track event
  async trackEvent(experimentId, userId, anonymousId, eventType, metadata = null) {
    try {
      const assignment = await VariantAssignment.findOne({
        experiment: experimentId,
        $or: [
          ...(userId ? [{ user: userId }] : []),
          ...(anonymousId ? [{ anonymousId }] : [])
        ]
      })

      if (!assignment) return

      await assignment.trackEvent(eventType, metadata)

      // Update experiment stats
      const experiment = await Experiment.findById(experimentId)
      if (!experiment) return

      const variant = experiment.variants.find(v => v.name === assignment.variant)
      if (!variant) return

      if (eventType === 'conversion') {
        variant.stats.conversions += 1
        await assignment.markConverted(metadata?.value)
        
        if (metadata?.value) {
          variant.stats.revenue += metadata.value
        }
      }

      await experiment.save()
    } catch (error) {
      console.error('Track event error:', error)
    }
  }

  // Calculate experiment results
  async calculateResults(experimentId) {
    try {
      const experiment = await Experiment.findById(experimentId)
      if (!experiment) return null

      const results = {
        variants: []
      }

      // Calculate metrics for each variant
      for (const variant of experiment.variants) {
        const conversionRate = experiment.calculateConversionRate(variant.name)
        const avgRevenue = variant.stats.impressions > 0 
          ? variant.stats.revenue / variant.stats.impressions 
          : 0

        results.variants.push({
          name: variant.name,
          impressions: variant.stats.impressions,
          conversions: variant.stats.conversions,
          conversionRate: conversionRate.toFixed(2),
          revenue: variant.stats.revenue,
          avgRevenue: avgRevenue.toFixed(2)
        })
      }

      // Statistical significance (for A/B tests)
      if (experiment.variants.length === 2) {
        const significance = experiment.calculateStatisticalSignificance()
        results.significance = significance

        // Determine winner
        if (significance?.isSignificant) {
          const [control, variant] = experiment.variants
          const controlRate = experiment.calculateConversionRate(control.name)
          const variantRate = experiment.calculateConversionRate(variant.name)

          if (variantRate > controlRate) {
            results.winner = variant.name
            results.uplift = ((variantRate - controlRate) / controlRate * 100).toFixed(2)
          } else {
            results.winner = control.name
            results.uplift = 0
          }
        }
      }

      return results
    } catch (error) {
      console.error('Calculate results error:', error)
      return null
    }
  }

  // Auto-select winner
  async autoSelectWinner(experimentId) {
    try {
      const experiment = await Experiment.findById(experimentId)
      if (!experiment || !experiment.settings.autoSelectWinner) return

      const results = await this.calculateResults(experimentId)
      
      if (results?.significance?.isSignificant && results.winner) {
        experiment.status = 'completed'
        experiment.results = {
          winner: results.winner,
          confidence: results.significance.confidence,
          uplift: results.uplift,
          completedAt: Date.now()
        }

        await experiment.save()

        console.log(`✅ Experiment ${experiment.name} completed. Winner: ${results.winner}`)
      }
    } catch (error) {
      console.error('Auto-select winner error:', error)
    }
  }
}

// Create singleton instance
let service;
try {
  service = new ExperimentService();
  console.log('✅ ExperimentService initialized');
  console.log('   Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(service)).filter(m => m !== 'constructor'));
} catch (error) {
  console.error('❌ Failed to initialize ExperimentService:', error.message);
  service = {};
}

module.exports = service