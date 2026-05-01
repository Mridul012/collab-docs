import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useEffect, useRef, useState } from 'react'

function CollabEditorInner({ ydoc, provider, currentUser, onEditorReady, onSaveVersion }) {
  useEffect(() => {
    if (!onSaveVersion) return
    onSaveVersion(() => {
      const update = Y.encodeStateAsUpdate(ydoc)
      let binary = ''
      const bytes = new Uint8Array(update)
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return btoa(binary)
    })
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        undoRedo: false,
      }),
      Collaboration.configure({ document: ydoc }),
    ],
    editorProps: {
      attributes: { class: 'prose max-w-none focus:outline-none p-0' },
    },
    onCreate: ({ editor }) => {
      if (onEditorReady) onEditorReady(editor)
    },
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection
      provider.awareness.setLocalStateField('user', {
        ...provider.awareness.getLocalState()?.user,
        cursor: { from, to },
      })
    },
  })

  return <EditorContent editor={editor} className="h-full" />
}

export default function CollabEditor({
  documentId,
  currentUser,
  onEditorReady,
  onOnlineCountChange,
  onSaveVersion,
  onAwarenessReady,
}) {
  const [providerReady, setProviderReady] = useState(false)
  const ydocRef = useRef(null)
  const providerRef = useRef(null)

  useEffect(() => {
    setProviderReady(false)

    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider(
      import.meta.env.VITE_WS_URL + '/yjs',
      documentId,
      ydoc
    )

    ydocRef.current = ydoc
    providerRef.current = provider
    onAwarenessReady?.(provider.awareness)

    const handleSync = (isSynced) => {
      if (isSynced) {
        setProviderReady(true)
        provider.awareness.setLocalStateField('user', {
          name: currentUser.name,
          color: currentUser.color,
        })
      }
    }

    provider.on('sync', handleSync)

    const fallback = setTimeout(() => {
      setProviderReady(true)
      provider.awareness.setLocalStateField('user', {
        name: currentUser.name,
        color: currentUser.color,
      })
    }, 2000)

    const updateCount = () => {
      const count = Array.from(provider.awareness.getStates().values())
        .filter((s) => s.user).length
      onOnlineCountChange(count)
    }

    provider.awareness.on('change', updateCount)

    return () => {
      provider.off('sync', handleSync)
      provider.awareness.off('change', updateCount)
      clearTimeout(fallback)
      onAwarenessReady?.(null)
      setTimeout(() => {
        provider.destroy()
        ydoc.destroy()
        if (providerRef.current === provider) providerRef.current = null
        if (ydocRef.current === ydoc) ydocRef.current = null
      }, 100)
    }
  }, [documentId])

  if (!providerReady) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#333] text-xs font-mono">
        connecting...
      </div>
    )
  }

  return (
    <CollabEditorInner
      ydoc={ydocRef.current}
      provider={providerRef.current}
      currentUser={currentUser}
      onEditorReady={onEditorReady}
      onSaveVersion={onSaveVersion}
    />
  )
}
