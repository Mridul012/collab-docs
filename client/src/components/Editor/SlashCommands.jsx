import { useState, useEffect } from 'react'
import useAuthStore from '../../store/authStore.js'

const COMMANDS = [
  { label: 'improve writing', prompt: 'Improve the writing of this text, make it clearer and more professional' },
  { label: 'summarize', prompt: 'Summarize this text concisely in a few sentences' },
  { label: 'expand', prompt: 'Expand this text with more detail and examples' },
  { label: 'fix grammar', prompt: 'Fix all grammar and spelling errors in this text' },
]

export default function SlashCommands({ editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      const { state } = editor
      const { $from } = state.selection

      const lineStart = $from.start()
      const textBeforeCursor = state.doc.textBetween(lineStart, $from.pos)

      if (textBeforeCursor === '/') {
        const coords = editor.view.coordsAtPos($from.pos)
        setPosition({ top: coords.bottom + window.scrollY + 4, left: coords.left })
        setSelectedIndex(0)
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    editor.on('transaction', handleUpdate)
    return () => editor.off('transaction', handleUpdate)
  }, [editor])

  async function onSelectCommand(command) {
    if (!editor) return

    setIsLoading(true)

    const docText = editor.getText()
    const { $from } = editor.state.selection
    const lineStart = $from.start()
    editor.commands.deleteRange({ from: lineStart, to: $from.pos })

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
          body: JSON.stringify({ prompt: command.prompt, context: docText }),
        }
      )

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const { text } = JSON.parse(data)
              if (text) editor.commands.insertContent(text)
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error('AI command failed:', err)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % COMMANDS.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + COMMANDS.length) % COMMANDS.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSelectCommand(COMMANDS[selectedIndex])
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex])

  if (!isOpen) return null

  return (
    <div
      style={{ top: position.top, left: position.left }}
      className="fixed bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg w-52 z-50 overflow-hidden"
    >
      <p className="px-3 py-2 text-[#333] text-[9px] font-mono uppercase tracking-widest border-b border-[#1a1a1a]">
        ai commands
      </p>
      {isLoading ? (
        <p className="px-3 py-3 text-[#444] text-xs font-mono animate-pulse">
          generating...
        </p>
      ) : (
        COMMANDS.map((cmd, i) => (
          <button
            key={cmd.label}
            onClick={() => onSelectCommand(cmd)}
            className={`w-full text-left px-3 py-2.5 text-xs font-mono transition-all block ${
              i === selectedIndex ? 'text-white bg-[#111]' : 'text-[#555] hover:text-white hover:bg-[#111]'
            }`}
          >
            / {cmd.label}
          </button>
        ))
      )}
    </div>
  )
}
