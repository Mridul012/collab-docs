import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getDocuments, createDocument, deleteDocument } from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/shared/Navbar.jsx'

const dotGrid = {
  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocuments().then((res) => res.data),
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
    },
  })

  const documents = data || []

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <Navbar />
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-52 min-w-[208px] bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col">
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
          {isLoading ? (
            <p className="text-[#333] text-xs font-mono px-3">loading...</p>
          ) : documents.length === 0 ? (
            <button
              onClick={() => createMutation.mutate()}
              className="text-[#333] text-xs font-mono px-3 text-left w-full hover:text-white transition-colors"
            >
              + create your first document
            </button>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center w-full px-3 py-2 rounded text-[13px] font-mono transition-all cursor-pointer hover:bg-[#111]"
              >
                <div className="w-2 h-2 rounded-full bg-[#333] group-hover:bg-[#555] mr-2 shrink-0" />
                <button
                  className="flex-1 text-left truncate text-[#666] group-hover:text-[#ccc]"
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
            )))
          }
        </div>

        <div className="p-4 border-t border-[#1a1a1a]">
          <p className="text-[#333] text-[11px] font-mono truncate">{user?.email}</p>
        </div>
      </aside>

      {/* Main area */}
      <main
        className="flex-1 bg-black flex items-center justify-center"
        style={dotGrid}
      >
        <p className="text-[#222] text-xs font-mono tracking-[0.15em]">
          SELECT OR CREATE A DOCUMENT
        </p>
      </main>
    </div>
    </div>
  )
}
