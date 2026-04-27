import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/document.controller.js'

const router = Router()

router.use(protect)

router.get('/', getDocuments)
router.post('/', createDocument)
router.get('/:id', getDocument)
router.put('/:id', updateDocument)
router.delete('/:id', deleteDocument)

export default router
