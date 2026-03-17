import {
  LayoutDashboard, Users, FileText, DollarSign, Building2,
  CalendarDays, Umbrella, UserMinus, ShieldAlert, ShieldCheck,
  FolderOpen, Settings, CreditCard,
} from 'lucide-react';

const ALL_ROLES = ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN', 'WORKER'];
const ALL_MANAGEMENT = ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN'];
const OWNER_ADMIN = ['SUPER_ADMIN', 'OWNER', 'ADMIN'];

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ALL_ROLES },
  { href: '/trabajadores', label: 'Trabajadores', icon: Users, roles: ALL_MANAGEMENT },
  { href: '/contratos', label: 'Contratos', icon: FileText, roles: ALL_ROLES },
  { href: '/liquidaciones', label: 'Liquidaciones', icon: DollarSign, roles: ALL_ROLES },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: Building2, roles: ALL_MANAGEMENT, badgeKey: 'cotizaciones' },
  { href: '/asistencia', label: 'Asistencia', icon: CalendarDays, roles: ALL_ROLES },
  { href: '/vacaciones', label: 'Vacaciones', icon: Umbrella, roles: ALL_ROLES, badgeKey: 'vacaciones' },
  { href: '/finiquitos', label: 'Finiquitos', icon: UserMinus, roles: ALL_MANAGEMENT },
  { href: '/ley-karin', label: 'Ley Karin', icon: ShieldAlert, roles: ALL_MANAGEMENT, badgeKey: 'denuncias' },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck, roles: ALL_MANAGEMENT },
  { href: '/documentos', label: 'Documentos', icon: FolderOpen, roles: ALL_MANAGEMENT },
  { href: '/configuracion', label: 'Configuración', icon: Settings, roles: OWNER_ADMIN },
  { href: '/planes', label: 'Planes', icon: CreditCard, roles: OWNER_ADMIN },
];

export function getNavItemsForRole(role) {
  return navItems.filter(item => item.roles.includes(role));
}
