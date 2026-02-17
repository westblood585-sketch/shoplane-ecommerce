const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: {
          status: dbStatus,
          name: mongoose.connection.name
        },
        memory: {
          usage: process.memoryUsage(),
          free: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
        },
        cpu: {
          usage: process.cpuUsage()
        }
      }
    }

    res.status(200).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: error.message
    })
  }
})

// Ready check - for Kubernetes/container orchestration
router.get('/ready', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1
    
    if (dbStatus) {
      return res.status(200).json({ 
        status: 'ready',
        timestamp: new Date().toISOString()
      })
    } else {
      return res.status(503).json({ 
        status: 'not_ready',
        reason: 'Database not connected',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    return res.status(503).json({ 
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Live check - for Kubernetes/container orchestration
router.get('/live', (req, res) => {
  res.status(200).json({ 
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

module.exports = router
