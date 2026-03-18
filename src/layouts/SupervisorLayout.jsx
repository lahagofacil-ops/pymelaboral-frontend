import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SupervisorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#2563EB]">PymeLaboral</h1>
          <p className="text-xs text-[#6B7280]">Supervisora</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6B7280]">{user?.nombre || 'Supervisora'}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#DC2626] hover:text-red-700 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
