import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="h-12 bg-black border-b border-[#1a1a1a] px-6 flex items-center justify-between">
      <span className="text-white text-sm font-mono font-semibold tracking-[0.2em]">
        COLLABDOCS
      </span>
      <div className="flex gap-4 items-center">
        <span className="text-[#555] text-xs font-mono">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-[#888] hover:text-white text-xs font-mono border border-[#222] hover:border-[#444] px-3 py-1.5 rounded transition-all cursor-pointer"
        >
          logout
        </button>
      </div>
    </nav>
  )
}
