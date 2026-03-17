import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, Settings, Plus, Users, FileText, DollarSign, Umbrella } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUser, setShowUser] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const userRef = useRef(null);
  const quickRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (quickRef.current && !quickRef.current.contains(e.target)) setShowQuick(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isManagement = ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN'].includes(user?.role);
  const initials = user?.nombre ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  const quickActions = [
    { label: 'Nuevo trabajador', icon: Users, href: '/trabajadores/nuevo' },
    { label: 'Nuevo contrato', icon: FileText, href: '/contratos/nuevo' },
    { label: 'Nueva liquidación', icon: DollarSign, href: '/liquidaciones/nueva' },
    { label: 'Solicitar vacaciones', icon: Umbrella, href: '/vacaciones' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm text-gray-500">{user?.empresaNombre || 'PymeLaboral'}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick actions */}
        {isManagement && (
          <div className="relative" ref={quickRef}>
            <button onClick={() => setShowQuick(!showQuick)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Acciones</span>
            </button>
            {showQuick && (
              <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {quickActions.map(a => (
                  <Link key={a.href} to={a.href} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowQuick(false)}>
                    <a.icon className="h-4 w-4 text-gray-400" /> {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
              {initials}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showUser && (
            <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link to="/configuracion" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUser(false)}>
                <Settings className="h-4 w-4 text-gray-400" /> Configuración
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
