import { useNavigate } from 'react-router-dom'

const dotGrid = {
  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      className="bg-black min-h-screen flex flex-col items-center justify-center"
      style={dotGrid}
    >
      <p className="text-[#1a1a1a] text-8xl font-mono font-bold mb-4">404</p>
      <p className="text-[#333] text-xs font-mono tracking-widest mb-8">page not found</p>
      <button
        onClick={() => navigate('/')}
        className="text-[#444] hover:text-white text-xs font-mono transition-colors"
      >
        ← go home
      </button>
    </div>
  )
}
