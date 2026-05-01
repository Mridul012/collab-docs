import { PrismaClient } from '@prisma/client'
import * as Y from 'yjs'
import crypto from 'crypto'
import ldb from '../websocket/leveldb.js'

const prisma = new PrismaClient()

export const createDocument = async (req, res) => {
  try {
    const title = req?.body?.title || 'Untitled'

    const document = await prisma.document.create({
      data: {
        title,
        ownerId: req.user.userId
      }
    })

    res.status(201).json(document)
  } catch (error) {
    console.error('createDocument error:', error)
    res.status(500).json({ message: 'Failed to create document' })
  }
}

export async function getDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: { ownerId: req.user.userId },
      orderBy: { updatedAt: 'desc' },
    })

    res.status(200).json(documents)
  } catch (error) {
    console.error('getDocuments error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getDocument(req, res) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
    })

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    if (document.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.status(200).json(document)
  } catch (error) {
    console.error('getDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function updateDocument(req, res) {
  try {
    const { title, content } = req.body

    const existing = await prisma.document.findUnique({
      where: { id: req.params.id },
    })

    if (!existing) {
      return res.status(404).json({ message: 'Document not found' })
    }

    if (existing.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: { title, content },
    })

    res.status(200).json(document)
  } catch (error) {
    console.error('updateDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function deleteDocument(req, res) {
  try {
    const existing = await prisma.document.findUnique({
      where: { id: req.params.id },
    })

    if (!existing) {
      return res.status(404).json({ message: 'Document not found' })
    }

    if (existing.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await prisma.version.deleteMany({
      where: { documentId: req.params.id },
    })

    await prisma.document.delete({
      where: { id: req.params.id },
    })

    res.status(200).json({ message: 'Document deleted' })
  } catch (error) {
    console.error('deleteDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function saveVersion(req, res) {
  try {
    const documentId = req.params.id
    const { snapshot, label = 'snapshot' } = req.body

    const doc = await prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    if (doc.ownerId !== req.user.userId) return res.status(403).json({ message: 'Access denied' })

    const buffer = Buffer.from(snapshot, 'base64')

    const version = await prisma.version.create({
      data: { documentId, snapshot: buffer, label },
    })

    res.status(201).json({ id: version.id, createdAt: version.createdAt })
  } catch (error) {
    console.error('saveVersion error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getVersion(req, res) {
  try {
    const { id: documentId, versionId } = req.params

    const doc = await prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    if (doc.ownerId !== req.user.userId) return res.status(403).json({ message: 'Access denied' })

    const version = await prisma.version.findUnique({ where: { id: versionId } })
    if (!version) return res.status(404).json({ message: 'Version not found' })

    const base64 = Buffer.from(version.snapshot).toString('base64')
    res.json({ snapshot: base64 })
  } catch (error) {
    console.error('getVersion error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getVersions(req, res) {
  try {
    const documentId = req.params.id

    const doc = await prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    if (doc.ownerId !== req.user.userId) return res.status(403).json({ message: 'Access denied' })

    const versions = await prisma.version.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, label: true, createdAt: true },
    })

    res.status(200).json(versions)
  } catch (error) {
    console.error('getVersions error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function shareDocument(req, res) {
  try {
    const { id } = req.params
    const doc = await prisma.document.findUnique({ where: { id } })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    if (doc.ownerId !== req.user.userId) return res.status(403).json({ message: 'Access denied' })

    const shareToken = crypto.randomBytes(16).toString('hex')
    await prisma.document.update({
      where: { id },
      data: { isPublic: true, shareToken },
    })

    const shareUrl = process.env.CLIENT_URL
      ? process.env.CLIENT_URL + '/share/' + shareToken
      : null
    res.json({ shareToken, shareUrl })
  } catch (error) {
    console.error('shareDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getSharedDocument(req, res) {
  try {
    const { token } = req.params
    const doc = await prisma.document.findFirst({
      where: { shareToken: token, isPublic: true },
      select: { id: true, title: true, shareToken: true },
    })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    res.json(doc)
  } catch (error) {
    console.error('getSharedDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getShareStatus(req, res) {
  try {
    const { id } = req.params
    const doc = await prisma.document.findUnique({
      where: { id },
      select: { isPublic: true, shareToken: true, ownerId: true },
    })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    if (doc.ownerId !== req.user.userId) return res.status(403).json({ message: 'Access denied' })
    res.json({ isPublic: doc.isPublic, shareToken: doc.shareToken })
  } catch (error) {
    console.error('getShareStatus error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const applySnapshot = async (req, res) => {
  try {
    const { id: documentId, versionId } = req.params

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })
    if (!document) return res.status(404).json({ message: 'Document not found' })
    if (document.ownerId !== req.user.userId)
      return res.status(403).json({ message: 'Forbidden' })

    const version = await prisma.version.findUnique({
      where: { id: versionId }
    })
    if (!version) return res.status(404).json({ message: 'Version not found' })

    console.log('applySnapshot called for doc:', documentId, 'version:', versionId)
    console.log('version snapshot size:', version.snapshot.length, 'bytes')

    await ldb.clearDocument(documentId)
    console.log('leveldb cleared for doc:', documentId)

    const ydoc = new Y.Doc()
    Y.applyUpdate(ydoc, version.snapshot)
    const newUpdate = Y.encodeStateAsUpdate(ydoc)
    console.log('newUpdate size:', newUpdate.length)

    await ldb.storeUpdate(documentId, newUpdate)
    console.log('leveldb store complete')

    res.json({ success: true })
  } catch (error) {
    console.error('applySnapshot error:', error)
    res.status(500).json({ message: 'Failed to restore version' })
  }
}
