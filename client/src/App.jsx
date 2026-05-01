import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore.js'
import HomePage from './pages/HomePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EditorPage from './pages/EditorPage.jsx'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SharedEditorPage from './pages/SharedEditorPage.jsx'

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:token" element={<SharedEditorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
