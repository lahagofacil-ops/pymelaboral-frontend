import {
  LayoutDashboard, Users, FileText, DollarSign, Building2,
  CalendarDays, Umbrella, UserMinus, ShieldAlert, ShieldCheck,
  FolderOpen, Settings, CreditCard, Shield,
} from 'lucide-react';

const ALL_MANAGEMENT = ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN'];
const OWNER_ADMIN = ['SUPER_ADMIN', 'OWNER', 'ADMIN'];

export const navItems = [
  // Everyone
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN', 'WORKER'] },

  // Management only
  { href: '/trabajadores', label: 'Trabajadores', icon: Users, roles: ALL_MANAGEMENT },
  { href: '/contratos', label: 'Contratos', icon: FileText, roles: ALL_MANAGEMENT },
  { href: '/liquidaciones', label: 'Liquidaciones', icon: DollarSign, roles: ALL_MANAGEMENT },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: Building2, roles: ALL_MANAGEMENT, badgeKey: 'cotizaciones' },
  { href: '/asistencia', label: 'Asistencia', icon: CalendarDays, roles: ALL_MANAGEMENT },
  { href: '/vacaciones', label: 'Vacaciones', icon: Umbrella, roles: ALL_MANAGEMENT, badgeKey: 'vacaciones' },
  { href: '/finiquitos', label: 'Finiquitos', icon: UserMinus, roles: ALL_MANAGEMENT },
  { href: '/ley-karin', label: 'Ley Karin', icon: ShieldAlert, roles: ALL_MANAGEMENT, badgeKey: 'denuncias' },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck, roles: ALL_MANAGEMENT },
  { href: '/documentos', label: 'Documentos', icon: FolderOpen, roles: ALL_MANAGEMENT },
  { href: '/configuracion', label: 'Configuración', icon: Settings, roles: OWNER_ADMIN },
  { href: '/planes', label: 'Planes', icon: CreditCard, roles: ['OWNER'] },

  // Worker only
  { href: '/contratos', label: 'Mi Contrato', icon: FileText, roles: ['WORKER'] },
  { href: '/liquidaciones', label: 'Mis Liquidaciones', icon: DollarSign, roles: ['WORKER'] },
  { href: '/asistencia', label: 'Mi Asistencia', icon: CalendarDays, roles: ['WORKER'] },
  { href: '/vacaciones', label: 'Mis Vacaciones', icon: Umbrella, roles: ['WORKER'] },
];

export function getNavItemsForRole(role) {
  return navItems.filter(item => item.roles.includes(role));
}
