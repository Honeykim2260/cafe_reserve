import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3005

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}))

// CORS 설정 - 테스트 환경에서는 모든 origin 허용
app.use(cors({
  origin: true, // 모든 origin 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  exposedHeaders: ['set-cookie']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api', limiter)

// Preflight OPTIONS 요청 처리
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

// Body parsing middleware
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Import routes
import authRoutes from './routes/auth-mock'
import cafeRoutes from './routes/cafes-mock'
import reservationRoutes from './routes/reservations-mock'

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/cafes', cafeRoutes)
app.use('/api/reservations', reservationRoutes)

app.get('/api', (req, res) => {
  res.json({ 
    message: 'MyCafe API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cafes: '/api/cafes',
      api: '/api'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: { 
      code: 'NOT_FOUND', 
      message: 'Route not found' 
    }
  })
})

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error)
  res.status(500).json({ 
    success: false, 
    error: { 
      code: 'INTERNAL_SERVER_ERROR', 
      message: 'Something went wrong!' 
    }
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app