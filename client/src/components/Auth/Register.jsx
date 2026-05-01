import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { register } from '../../services/api.js'

const dotGrid = {
  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

const inputClass = 'w-full bg-[#111] border border-[#1a1a1a] hover:border-[#333] focus:border-[#555] rounded px-3 py-2 text-[#ededed] text-xs font-mono outline-none transition-colors placeholder-[#333] mb-4'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await register(name, email, password)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center"
      style={dotGrid}
    >
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-8 w-full max-w-sm">
        <p className="text-white text-xs font-mono font-semibold tracking-[0.2em] mb-1">
          COLLABDOCS
        </p>
        <p className="text-[#444] text-xs font-mono mb-8">create account</p>

        <form onSubmit={handleSubmit}>
          <label className="text-[#444] text-[10px] font-mono uppercase tracking-widest mb-1 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className={inputClass}
          />

          <label className="text-[#444] text-[10px] font-mono uppercase tracking-widest mb-1 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />

          <label className="text-[#444] text-[10px] font-mono uppercase tracking-widest mb-1 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-[#ededed] text-black text-xs font-mono font-semibold py-2.5 rounded transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? 'registering...' : 'register →'}
          </button>

          {error && <p className="text-red-500 text-xs font-mono mt-3">{error}</p>}
        </form>

        <p className="text-[#444] text-xs font-mono text-center mt-6">
          have an account?{' '}
          <Link to="/login" className="text-white hover:text-[#ededed]">
            login
          </Link>
        </p>
      </div>
    </div>
  )
}
