import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  saveVersion,
  getVersions,
  getVersion,
  applySnapshot,
  shareDocument,
  getSharedDocument,
  getShareStatus,
} from '../controllers/document.controller.js'

const router = Router()

// Public — must come before /:id to prevent Express matching "share" as an id param
router.get('/share/:token', getSharedDocument)

router.get('/', protect, getDocuments)
router.post('/', protect, createDocument)
router.get('/:id/share-status', protect, getShareStatus)
router.post('/:id/share', protect, shareDocument)
router.get('/:id', protect, getDocument)
router.put('/:id', protect, updateDocument)
router.delete('/:id', protect, deleteDocument)
router.post('/:id/versions', protect, saveVersion)
router.get('/:id/versions', protect, getVersions)
router.get('/:id/versions/:versionId', protect, getVersion)
router.post('/:id/versions/:versionId/restore', protect, applySnapshot)

export default router
