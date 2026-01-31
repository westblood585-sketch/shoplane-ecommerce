const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const { Server } = require('socket.io')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const compression = require('compression')
const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app)

// Security Middleware (Production)
if (process.env.NODE_ENV === 'production') {
  // Helmet - HTTP headers security
  app.use(helmet())
  
  // Rate limiting - DDoS protection
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Max 100 requests per window
  })
  app.use('/api/', limiter)
  
  // Data sanitization - NoSQL injection protection
  app.use(mongoSanitize())
  
  // XSS protection
  app.use(xss())
  
  // HTTP Parameter Pollution
  app.use(hpp())
  
  // Compression
  app.use(compression())
}

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'https://myshop-dogukanbayar.vercel.app'
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Socket.IO Setup
const io = new Server(server, {
  cors: corsOptions
})

// Socket.IO Connection
io.on('connection', (socket) => {
  // Sadece yeni kullanıcı bağlantılarını logla (spam'i önlemek için)
  // console.log('🔌 User connected:', socket.id)
  
  socket.on('disconnect', () => {
    // console.log('🔌 User disconnected:', socket.id)
  })
  
  // Önemli olayları dinle
  socket.on('join_room', (data) => {
    socket.join(data.room)
    console.log(`👤 User ${socket.id} joined room: ${data.room}`)
  })
})

// Make io accessible to routes
app.set('io', io)

// TEMEL ROUTES
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/addresses', require('./routes/addressRoutes'))
app.use('/api/favorites', require('./routes/favoriteRoutes'))
app.use('/api/gamification', require('./routes/gamificationRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))
// app.use('/api/gift-cards', require('./routes/giftCardRoutes')) // Temporarily disabled

// Review routes (nested)
const reviewRoutes = require('./routes/reviewRoutes')
app.use('/api/products/:productId/reviews', reviewRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-ticaret API çalışıyor! 🚀'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 Server çalışıyor!                ║
  ║   📍 Port: ${PORT}                      ║
  ║   🌍 Mode: ${process.env.NODE_ENV}    ║
  ╚═══════════════════════════════════════╝
  `)
})

process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`)
})
