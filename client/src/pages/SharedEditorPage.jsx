import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CollabEditor from '../components/Editor/CollabEditor.jsx'
import CollabCursors from '../components/Editor/CollabCursors.jsx'
import { getSharedDocument } from '../services/api.js'

const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316','#84cc16']

export default function SharedEditorPage() {
  const { token } = useParams()
  const [doc, setDoc] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [editor, setEditor] = useState(null)
  const [awareness, setAwareness] = useState(null)
  const [onlineCount, setOnlineCount] = useState(1)

  const [guestUser] = useState(() => {
    const id = 'guest-' + Math.random().toString(36).slice(2)
    const color = colors[id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length]
    return { name: 'Guest', color }
  })

  useEffect(() => {
    getSharedDocument(token)
      .then((res) => setDoc(res.data))
      .catch(() => setNotFound(true))
  }, [token])

  if (notFound) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <p className="text-[#555] font-mono text-sm">Document not found or link expired</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <p className="text-[#333] font-mono text-xs">loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="h-12 bg-black border-b border-[#1a1a1a] px-8 flex items-center justify-between shrink-0">
        <p className="text-[#555] text-sm font-mono">
          Viewing shared document:{' '}
          <span className="text-[#ccc]">{doc.title || 'untitled'}</span>
        </p>
        <div className="flex items-center gap-1.5 bg-[#0d1f0d] border border-[#1a3a1a] px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span className="text-[#4ade80] text-xs font-mono">{onlineCount} online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ background: '#050505' }}>
        <div className="max-w-2xl mx-auto w-full pt-12 pb-12 px-4">
          <CollabEditor
            documentId={doc.id}
            currentUser={guestUser}
            onEditorReady={setEditor}
            onOnlineCountChange={setOnlineCount}
            onAwarenessReady={setAwareness}
          />
        </div>
      </div>
      <CollabCursors editor={editor} awareness={awareness} />
    </div>
  )
}
