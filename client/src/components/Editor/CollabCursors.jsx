import { useEffect, useState } from 'react'

export default function CollabCursors({ editor, awareness }) {
  const [cursors, setCursors] = useState([])

  useEffect(() => {
    if (!awareness || !editor) return

    const update = () => {
      const next = []
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === awareness.clientID) return
        if (!state.user?.cursor) return
        next.push({ clientId, name: state.user.name, color: state.user.color, cursor: state.user.cursor })
      })
      setCursors(next)
    }

    awareness.on('change', update)
    return () => awareness.off('change', update)
  }, [awareness, editor])

  if (!editor || cursors.length === 0) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {cursors.map(({ clientId, name, color, cursor }) => {
        try {
          const docSize = editor.state.doc.content.size
          const pos = Math.max(0, Math.min(cursor.from, docSize - 1))
          const coords = editor.view.coordsAtPos(pos)
          return (
            <div
              key={clientId}
              style={{
                position: 'fixed',
                left: coords.left,
                top: coords.top - 22,
                background: color,
                color: '#fff',
                fontSize: '10px',
                fontFamily: 'monospace',
                padding: '1px 6px',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {name}
            </div>
          )
        } catch {
          return null
        }
      })}
    </div>
  )
}
