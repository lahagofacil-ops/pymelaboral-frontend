import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEmpresa } from '../hooks/useEmpresa'
import Spinner from './ui/Spinner'
import { ROLES } from '../lib/constants'

export default function ProtectedRoute({
  allowedRoles = [],
  requireImpersonation = false,
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const { isImpersonating } = useEmpresa()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user?.role)

    const canImpersonate =
      (user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.SUPERVISOR) &&
      requireImpersonation &&
      isImpersonating

    if (!hasRole && !canImpersonate) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
          <h1 className="text-2xl font-bold text-[#111827] mb-2">403</h1>
          <p className="text-[#6B7280]">No tienes permisos para acceder a esta página.</p>
          <a href="/" className="mt-4 text-sm text-[#2563EB] hover:underline">
            Volver al inicio
          </a>
        </div>
      )
    }
  }

  if (requireImpersonation) {
    const needsImpersonation =
      user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.SUPERVISOR

    if (needsImpersonation && !isImpersonating) {
      const redirectPath =
        user?.role === ROLES.SUPER_ADMIN ? '/admin' : '/supervisor'
      return <Navigate to={redirectPath} replace />
    }
  }

  return <Outlet />
}
