import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createDocument(req, res) {
  try {
    const { title = 'Untitled' } = req.body

    const document = await prisma.document.create({
      data: {
        title,
        ownerId: req.user.userId,
      },
    })

    res.status(201).json(document)
  } catch (error) {
    console.error('createDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
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

    await prisma.document.delete({
      where: { id: req.params.id },
    })

    res.status(200).json({ message: 'Document deleted' })
  } catch (error) {
    console.error('deleteDocument error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
