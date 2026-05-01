import { WebSocketServer } from 'ws'
import { createRequire } from 'module'
import ldb from './leveldb.js'

// Use require so that y-websocket/bin/utils and yjs share the same CJS module
// instance — importing yjs as an ES module alongside the CJS y-websocket causes
// a "Yjs was already imported" error that breaks document sync.
const require = createRequire(import.meta.url)
const { setupWSConnection, setPersistence } = require('y-websocket/bin/utils')
const Y = require('yjs')

setPersistence({
  // bindState runs once per document when the first client connects, hydrating
  // the in-memory ydoc from whatever was last persisted to LevelDB.
  bindState: async (docName, yjsDoc) => {
    console.log('bindState called for doc:', docName)
    const persistedYdoc = await ldb.getYDoc(docName)
    console.log('loaded from leveldb, content length:', Y.encodeStateAsUpdate(persistedYdoc).length)
    Y.applyUpdate(yjsDoc, Y.encodeStateAsUpdate(persistedYdoc))
    // persist every incremental update so the document survives server restarts
    yjsDoc.on('update', (update) => {
      ldb.storeUpdate(docName, update)
    })
  },
  writeState: () => Promise.resolve(),
})

export default function setupYjsServer(httpServer) {
  // noServer: true lets us share the HTTP server with Express and manually
  // decide which upgrade requests to hand off to the WebSocket server.
  const wss = new WebSocketServer({ noServer: true })

  wss.on('connection', (ws, req) => {
    const docName = req.url.replace(/^\/yjs\//, '').split('?')[0]
    // awareness broadcasts ephemeral state (cursor positions, online presence)
    // to all connected clients without persisting it to LevelDB.
    setupWSConnection(ws, req, { docName })
  })

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname } = new URL(req.url, 'http://localhost')
    // only hand off /yjs/* upgrades — any other path (e.g. HMR) must not reach this server
    if (pathname.startsWith('/yjs')) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req)
      })
    } else {
      socket.destroy()
    }
  })
}
