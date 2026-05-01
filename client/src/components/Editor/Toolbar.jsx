export default function Toolbar({ editor }) {
  if (!editor) return null

  function btn(label, action, isActive) {
    return (
      <button
        onClick={action}
        className={`text-[13px] font-mono px-3 py-1.5 rounded transition-all cursor-pointer border ${
          isActive
            ? 'text-white bg-[#1a1a1a] border-[#333]'
            : 'text-[#777] hover:text-white hover:bg-[#111] border-transparent hover:border-[#2a2a2a]'
        }`}
      >
        {label}
      </button>
    )
  }

  const sep = <div className="w-px h-4 bg-[#1a1a1a] mx-1" />

  return (
    <div className="h-10 bg-black border-b border-[#1a1a1a] px-8 flex items-center gap-1 flex-shrink-0">
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {sep}
      {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
      {sep}
      {btn('•', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
      {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
      {sep}
      <button
        className="text-[#6366f1] hover:text-[#818cf8] border border-[#2a2040] hover:border-[#4338ca] text-[13px] font-mono px-3 py-1.5 rounded transition-all ml-1"
        onClick={() => {
          editor.chain().focus().insertContent('/').run()
        }}
      >
        / AI
      </button>
    </div>
  )
}
