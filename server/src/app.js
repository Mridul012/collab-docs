import http from 'http'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ].filter(Boolean)
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'
import aiRoutes from './routes/ai.routes.js'
import setupYjsServer from './websocket/yjsServer.js'

app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/ai', aiRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const server = http.createServer(app)

setupYjsServer(server)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
