import { useNavigate } from 'react-router-dom'

const dotGrid = {
  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

const features = [
  {
    icon: '⚡',
    title: 'REAL-TIME SYNC',
    desc: 'Conflict-free collaborative editing using Yjs CRDTs. Multiple users, zero conflicts, instant updates.',
  },
  {
    icon: '✦',
    title: 'AI CO-AUTHOR',
    desc: 'Type / to access AI writing commands. Summarize, expand, improve, or fix grammar with streaming responses.',

  },
  {
    icon: '◎',
    title: 'VERSION HISTORY',
    desc: 'Save snapshots at any point. Restore previous versions instantly — syncs to all connected users.',

  },
  {
    icon: '◈',
    title: 'CURSOR PRESENCE',
    desc: 'See exactly where collaborators are typing with colored cursors and name labels in real time.',

  },
  {
    icon: '▣',
    title: 'RICH TEXT EDITOR',
    desc: 'Full formatting — headings, bold, italic, lists. Built on Tiptap and ProseMirror.',

  }
]

const steps = [
  {
    num: '01 ——',
    title: 'Create a document',
    desc: 'Sign up and create your first document. Ready in seconds.',
  },
  {
    num: '02 ——',
    title: 'Share with your team',
    desc: 'Share the URL. Anyone with an account can join instantly.',
  },
  {
    num: '03 ——',
    title: 'Edit together',
    desc: 'See cursors, edits, and AI suggestions in real time.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 h-12 backdrop-blur-sm bg-black/90 border-b border-[#1a1a1a] z-50 flex items-center justify-between px-8">
        <span className="text-white text-xs font-mono font-semibold tracking-[0.2em]">COLLABDOCS</span>
        <div className="flex gap-6 items-center">
          <a href="#features" className="text-[#555] hover:text-white text-xs font-mono transition-colors">features</a>
          <a href="#how" className="text-[#555] hover:text-white text-xs font-mono transition-colors">how it works</a>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-black text-xs font-mono font-semibold px-4 py-2 rounded hover:bg-[#ededed] transition-colors"
          >
            get started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12"
        style={dotGrid}
      >
        <div className="bg-[#0d1f0d] border border-[#1a3a1a] px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#4ade80] text-[11px] font-mono">real-time collaboration · AI-powered</span>
        </div>

        <h1 className="text-5xl font-semibold text-white leading-tight tracking-tight mb-5 font-mono">
          Documents that think<br />and sync together
        </h1>

        <p className="text-[#555] text-sm leading-relaxed max-w-md mx-auto mb-10 font-sans">
          A collaborative document editor with real-time sync, AI writing assistant, and version history.
        </p>

        <div className="flex gap-3 justify-center mb-16">
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-black text-xs font-mono font-semibold px-6 py-3 rounded hover:bg-[#ededed] transition-colors"
          >
            get started →
          </button>
        </div>

        {/* APP PREVIEW */}
        <div className="w-full max-w-3xl mx-auto border border-[#222] rounded-lg overflow-hidden">
          {/* Preview navbar */}
          <div className="h-9 bg-black border-b border-[#1a1a1a] flex items-center justify-between px-4">
            <span className="text-[9px] font-mono font-semibold text-white tracking-[0.2em]">COLLABDOCS</span>
            <span className="text-[9px] font-mono text-[#333]">mridul@test.com</span>
          </div>

          {/* Preview body */}
          <div className="flex h-60">
            {/* Sidebar */}
            <div className="w-36 bg-[#080808] border-r border-[#1a1a1a] p-2">
              <p className="text-[8px] font-mono text-[#333] tracking-[0.15em] mb-2 uppercase">Documents</p>
              <div className="bg-[#161616] border border-[#2a2a2a] text-[#ccc] text-[9px] font-mono px-2 py-1.5 rounded mb-1 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#555] shrink-0" />
                <span className="truncate">project-notes</span>
              </div>
              <div className="text-[#444] text-[9px] font-mono px-2 py-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#333] shrink-0" />
                <span className="truncate">meeting-recap</span>
              </div>
              <div className="text-[#444] text-[9px] font-mono px-2 py-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#333] shrink-0" />
                <span className="truncate">roadmap-q2</span>
              </div>
            </div>

            {/* Editor area */}
            <div className="flex-1 flex flex-col">
              {/* Top bar */}
              <div className="h-8 border-b border-[#1a1a1a] px-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#ccc]">project-notes</span>
                <div className="bg-[#0d1f0d] border border-[#1a3a1a] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#22c55e]" />
                  <span className="text-[#4ade80] text-[9px] font-mono">2 online</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="h-7 border-b border-[#1a1a1a] px-3 flex items-center gap-1">
                {[
                  { label: 'B', active: true },
                  { label: 'I', active: false },
                  { label: 'H1', active: true },
                  { label: 'H2', active: false },
                  { label: '•', active: false },
                  { label: '1.', active: false },
                ].map((btn) => (
                  <span
                    key={btn.label}
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      btn.active
                        ? 'text-white bg-[#1a1a1a] border-[#333]'
                        : 'text-[#555] border-transparent'
                    }`}
                  >
                    {btn.label}
                  </span>
                ))}
                <span className="text-[#1a1a1a] mx-0.5">|</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border text-[#6366f1] border-[#2a2040]">
                  /AI
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-[#050505] px-5 py-4">
                <p className="text-sm font-mono font-semibold text-white mb-2">Project Notes</p>
                <p className="text-[10px] text-[#666] font-sans leading-relaxed mb-2">
                  Real-time collaborative editing with Yjs CRDTs.{' '}
                  <span className="inline-block w-0.5 h-2.5 bg-indigo-500 align-middle animate-pulse" />
                  <span className="text-[8px] bg-indigo-500 text-white px-1 rounded font-mono ml-0.5 align-super leading-none">mridul</span>
                </p>
                <p className="text-[10px] text-[#555] font-sans">
                  Type / for AI commands — summarize, expand, improve writing.{' '}
                  <span className="inline-block w-0.5 h-2.5 bg-amber-500 align-middle animate-pulse" />
                  <span className="text-[8px] bg-amber-500 text-white px-1 rounded font-mono ml-0.5 align-super leading-none">sathvik</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-12 border-t border-[#0f0f0f]">
        <p className="text-[10px] text-[#444] font-mono tracking-[0.2em] text-center mb-3 uppercase">Features</p>
        <h2 className="text-3xl font-semibold text-white text-center font-mono tracking-tight mb-3">
          Everything you need to collaborate
        </h2>
        <p className="text-[#444] text-sm text-center font-sans mb-12">
          Built on modern open-source infrastructure for speed and reliability.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {features.slice(0, 3).map((f) => (
              <div key={f.title} className="bg-black hover:bg-[#080808] transition-colors p-7 border border-[#1a1a1a] rounded-lg">
                <div className="w-8 h-8 border border-[#222] rounded-md flex items-center justify-center mb-4 text-sm">
                  {f.icon}
                </div>
                <p className="text-sm font-bold font-mono text-[#ccc] mb-2 tracking-wider">{f.title}</p>
                <p className="text-base text-gray-400 leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-[66%] mx-auto">
            {features.slice(3).map((f) => (
              <div key={f.title} className="bg-black hover:bg-[#080808] transition-colors p-7 border border-[#1a1a1a] rounded-lg">
                <div className="w-8 h-8 border border-[#222] rounded-md flex items-center justify-center mb-4 text-sm">
                  {f.icon}
                </div>
                <p className="text-sm font-bold font-mono text-[#ccc] mb-2 tracking-wider">{f.title}</p>
                <p className="text-base text-gray-400 leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-12 border-t border-[#0f0f0f] bg-[#030303]">
        <p className="text-[10px] text-[#444] font-mono tracking-[0.2em] text-center mb-3 uppercase">How it works</p>
        <h2 className="text-3xl font-semibold text-white text-center font-mono tracking-tight mb-12">
          Simple by design
        </h2>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {steps.map((s) => (
            <div key={s.num}>
              <p className="text-[10px] text-[#555] font-mono mb-3 tracking-[0.1em]">{s.num}</p>
              <p className="text-lg font-semibold text-white font-mono mb-2">{s.title}</p>
              <p className="text-base text-gray-400 font-sans leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-12 border-t border-[#0f0f0f] text-center" style={dotGrid}>
        <h2 className="text-4xl font-semibold text-white font-mono tracking-tight mb-3">
          Ready to collaborate?
        </h2>
        <p className="text-[#444] text-sm font-sans mb-8">
          Create an account and start editing in real time
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-black text-xs font-mono font-semibold px-6 py-3 rounded hover:bg-[#ededed] transition-colors"
          >
            get started →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-12 border-t border-[#0f0f0f] flex items-center justify-between px-12">
        <span className="text-sm text-[#333] font-mono">© 2026 CollabDocs — built by Mridul</span>
        <div className="flex gap-6">
          <a href="#" className="text-[10px] text-[#333] font-mono hover:text-[#888] transition-colors">github</a>
          <a href="#" className="text-[10px] text-[#333] font-mono hover:text-[#888] transition-colors">linkedin</a>
        </div>
      </footer>

    </div>
  )
}
