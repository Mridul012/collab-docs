import { useState, useEffect } from 'react'
import { shareDocument, getShareStatus } from '../../services/api.js'

export default function ShareButton({ documentId }) {
  const [isShared, setIsShared] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getShareStatus(documentId)
      .then((res) => {
        if (res.data.isPublic && res.data.shareToken) {
          setIsShared(true)
          setShareUrl(window.location.origin + '/share/' + res.data.shareToken)
        }
      })
      .catch(() => {})
  }, [documentId])

  const handleShare = async () => {
    setLoading(true)
    try {
      const res = await shareDocument(documentId)
      setShareUrl(window.location.origin + '/share/' + res.data.shareToken)
      setIsShared(true)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-[#555] text-xs font-mono">
        <span className="inline-block animate-spin">⟳</span>
        sharing...
      </div>
    )
  }

  if (isShared) {
    return (
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={shareUrl}
          className="bg-[#111] border border-[#2a2a2a] text-[#888] text-xs font-mono px-2 py-1.5 rounded w-44 truncate outline-none"
        />
        <button
          onClick={handleCopy}
          className="text-xs font-mono px-3 py-1.5 rounded border border-[#2a2a2a] hover:border-[#444] bg-[#111] hover:bg-[#161616] transition-all cursor-pointer"
        >
          {copied
            ? <span className="text-green-400">Copied!</span>
            : <span className="text-[#888]">Copy</span>
          }
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleShare}
      className="text-[#888] hover:text-white text-xs font-mono border border-[#222] hover:border-[#444] px-3 py-1.5 rounded bg-transparent hover:bg-[#111] transition-all cursor-pointer"
    >
      ↗ Share
    </button>
  )
}
