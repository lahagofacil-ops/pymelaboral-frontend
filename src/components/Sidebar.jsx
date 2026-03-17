import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Shield, Users, FileText, DollarSign,
  Receipt, Clock, Palmtree, CalendarCheck, FileX, AlertTriangle,
  FolderOpen, ShieldCheck, Settings, Home, X,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useEmpresa } from '../hooks/useEmpresa'
import { NAV_ITEMS } from '../lib/constants'

const iconMap = {
  LayoutDashboard,
  Building2,
  Shield,
  Users,
  FileText,
  DollarSign,
  Receipt,
  Clock,
  Palmtree,
  CalendarCheck,
  FileX,
  AlertTriangle,
  FolderOpen,
  ShieldCheck,
  Settings,
  Home,
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const { empresaData, isImpersonating } = useEmpresa()

  const role = user?.role
  const navItems = NAV_ITEMS[role] || []

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E7EB]
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB]">
          <h1 className="text-xl font-bold text-[#2563EB]">PymeLaboral</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-[#6B7280] hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isImpersonating && empresaData && (
          <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
            <p className="text-xs font-medium text-[#D97706]">Empresa activa</p>
            <p className="text-sm font-semibold text-[#111827] truncate">
              {empresaData.razonSocial || empresaData.nombre || 'Empresa'}
            </p>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/supervisor' || item.path === '/empresa' || item.path === '/portal'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
