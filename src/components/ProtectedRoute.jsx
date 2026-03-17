import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth()

  // CRITICAL: Show spinner while auth is loading, do NOT redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const homeMap = {
      SUPER_ADMIN: '/admin',
      SUPERVISOR: '/supervisor',
      OWNER: '/empresa',
      ADMIN: '/empresa',
      WORKER: '/portal',
    }
    return <Navigate to={homeMap[role] || '/'} replace />
  }

  return <Outlet />
}
