import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNavItemsForRole } from '../../lib/nav-config';
import { useAuth } from '../../context/AuthContext';
import { useNotificationBadges } from '../../lib/hooks';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const badges = useNotificationBadges();
  const items = getNavItemsForRole(user?.role || 'WORKER');

  return (
    <aside className={`fixed left-0 top-0 z-30 flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
          PL
        </div>
        {!collapsed && <span className="text-sm font-bold text-[#2563EB]">PymeLaboral</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && badgeCount > 0 && (
                    <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-12 items-center justify-center border-t border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
