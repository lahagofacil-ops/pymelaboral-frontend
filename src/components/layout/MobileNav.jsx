import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getNavItemsForRole } from '../../lib/nav-config';
import { useAuth } from '../../context/AuthContext';

export function MobileNav({ open, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const items = getNavItemsForRole(user?.role || 'WORKER');

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">PL</div>
            <span className="text-sm font-bold text-[#2563EB]">PymeLaboral</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
