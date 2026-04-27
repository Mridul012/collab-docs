import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
