import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { aiComplete } from '../controllers/ai.controller.js'

const router = Router()

router.post('/complete', protect, aiComplete)

export default router
