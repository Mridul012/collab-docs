import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '../store/authStore.js'
import api, { getDocuments, getDocument, updateDocument, createDocument, deleteDocument } from '../services/api.js'
import Navbar from '../components/shared/Navbar.jsx'
import Toolbar from '../components/Editor/Toolbar.jsx'
import CollabEditor from '../components/Editor/CollabEditor.jsx'
import ShareButton from '../components/Editor/ShareButton.jsx'
import CollabCursors from '../components/Editor/CollabCursors.jsx'
import SlashCommands from '../components/Editor/SlashCommands.jsx'

const dotGrid = {
  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

const colors = [
  '#6366f1', '#f59e0b', '#10b981',
  '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#84cc16',
]

export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [title, setTitle] = useState('')
  const [onlineCount, setOnlineCount] = useState(1)
  const [editor, setEditor] = useState(null)
  const [awareness, setAwareness] = useState(null)
  const [showVersions, setShowVersions] = useState(false)
  const [versions, setVersions] = useState([])

  const saveVersionFnRef = useRef(null)
  const titleDebounceRef = useRef(null)
  const color = colors[
    user.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
  ]

  const { data: document } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id),
    enabled: !!id,
  })

  const { data: allDocs } = useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocuments().then((res) => res.data),
  })

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDocument(id, data),
  })

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['documents'])
      navigate('/editor/' + (res.id || res.data?.id))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      navigate('/dashboard')
    },
  })

  useEffect(() => {
    if (document) setTitle(document.title || '')
  }, [document])

  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)
    }
  }, [])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)
    titleDebounceRef.current = setTimeout(() => {
      updateMutation.mutate({ id, data: { title: newTitle } })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['document', id] })
    }, 1000)
  }

  const handleSaveVersion = async () => {
    if (!saveVersionFnRef.current) return
    const snapshot = saveVersionFnRef.current()
    if (!snapshot) {
      console.error('snapshot is null')
      return
    }
    const label = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
    await api.post(`/documents/${id}/versions`, { snapshot, label })
    if (showVersions) {
      const res = await api.get(`/documents/${id}/versions`)
      setVersions(res.data)
    }
  }

  const restoreVersion = async (versionId) => {
    try {
      await api.post(`/documents/${id}/versions/${versionId}/restore`)
      window.location.reload()
    } catch (error) {
      console.error('restore failed:', error)
    }
  }

  async function handleToggleVersions() {
    if (!showVersions) {
      const res = await api.get(`/documents/${id}/versions`)
      setVersions(res.data)
    }
    setShowVersions((v) => !v)
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <Navbar />
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left sidebar */}
      <aside className="w-52 min-w-52 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col">
        <div className="p-4">
          <p className="text-[#333] text-[9px] font-mono tracking-[0.25em] uppercase mb-3">
            Documents
          </p>
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full text-left px-3 py-2 text-[#aaa] hover:text-white bg-[#111] hover:bg-[#161616] border border-[#2a2a2a] hover:border-[#444] rounded text-[13px] font-mono transition-all disabled:opacity-40"
          >
            + new document
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {(allDocs || []).map((doc) => (
            <div
              key={doc.id}
              className={`group flex items-center w-full px-3 py-2 rounded text-[13px] font-mono transition-all cursor-pointer hover:bg-[#111] ${
                doc.id === id ? 'bg-[#161616] border border-[#2a2a2a]' : ''
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 shrink-0 group-hover:bg-[#555] ${doc.id === id ? 'bg-[#555]' : 'bg-[#333]'}`} />
              <button
                className={`flex-1 text-left truncate group-hover:text-[#ccc] ${doc.id === id ? 'text-[#ccc]' : 'text-[#666]'}`}
                onClick={() => navigate(`/editor/${doc.id}`)}
              >
                {doc.title || 'untitled'}
              </button>
              <button
                className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 text-xs ml-2 shrink-0 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm('Delete this document?')) {
                    deleteMutation.mutate(doc.id)
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#1a1a1a]">
          <p className="text-[#333] text-[11px] font-mono truncate">{user?.email}</p>
        </div>
      </aside>

      {/* Right area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="h-12 bg-black border-b border-[#1a1a1a] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#444] hover:text-white text-lg font-mono transition-colors"
            >
              ←
            </button>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="untitled"
              className="bg-transparent border-none outline-none text-[#ededed] text-base font-medium font-mono w-64 placeholder:text-[#333]"
            />
            {updateMutation.isPending && (
              <span className="text-[#333] text-[10px] font-mono">saving...</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ShareButton documentId={id} />
            <div className="flex items-center gap-1.5 bg-[#0d1f0d] border border-[#1a3a1a] px-3 py-1 rounded-full mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[#4ade80] text-xs font-mono">{onlineCount} online</span>
            </div>
            <button
              onClick={handleSaveVersion}
              className="text-[#888] hover:text-white text-xs font-mono border border-[#222] hover:border-[#444] px-3 py-1.5 rounded transition-all cursor-pointer bg-transparent"
            >
              save snapshot
            </button>
            <button
              onClick={handleToggleVersions}
              className="text-[#888] hover:text-white text-xs font-mono border border-[#222] hover:border-[#444] px-3 py-1.5 rounded transition-all cursor-pointer bg-transparent"
            >
              history
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
              <span className="text-[#444] text-xs font-mono">saved</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <Toolbar editor={editor} />

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#050505' }}>
          <div className="max-w-2xl mx-auto w-full pt-12 pb-12 px-4">
              <CollabEditor
                documentId={id}
                currentUser={{ name: user.name, color }}
                onEditorReady={setEditor}
                onOnlineCountChange={setOnlineCount}
                onSaveVersion={(fn) => { saveVersionFnRef.current = fn }}
                onAwarenessReady={setAwareness}
              />
              <CollabCursors editor={editor} awareness={awareness} />
              <SlashCommands editor={editor} />
          </div>
        </div>

        {/* Version history panel */}
        {showVersions && (
          <div className="absolute right-0 top-12 w-64 bottom-0 bg-[#0a0a0a] border-l border-[#1a1a1a] z-40 flex flex-col transition-all duration-200">
            <div className="px-4 py-3 border-b border-[#1a1a1a]">
              <p className="text-[#333] text-[9px] font-mono tracking-widest uppercase">
                Version History
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {versions.length === 0 ? (
                <p className="text-[#333] text-xs font-mono px-3 py-4">no snapshots yet</p>
              ) : (
                versions.map((v) => (
                  <div key={v.id} className="group px-3 py-2.5 rounded hover:bg-[#111] transition-colors">
                    <p className="text-[#666] text-xs font-mono">{v.label}</p>
                    <p className="text-[#333] text-[10px] font-mono mt-0.5">
                      {new Date(v.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => restoreVersion(v.id)}
                        className="text-[#444] hover:text-white text-[10px] font-mono transition-colors"
                      >
                        restore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
