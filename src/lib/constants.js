export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  WORKER: 'WORKER',
};

export const PLAN_LABELS = {
  STARTER: 'Starter',
  PROFESIONAL: 'Profesional',
  BUSINESS: 'Business',
};

export const AFP_OPTIONS = [
  'CAPITAL',
  'CUPRUM',
  'HABITAT',
  'MODELO',
  'PLANVITAL',
  'PROVIDA',
  'UNO',
];

export const SALUD_OPTIONS = [
  'FONASA',
  'BANMEDICA',
  'COLMENA',
  'CONSALUD',
  'CRUZ_BLANCA',
  'NUEVA_MASVIDA',
  'VIDA_TRES',
];

export const ESTADO_TRABAJADOR = [
  'ACTIVO',
  'LICENCIA',
  'VACACIONES',
  'DESVINCULADO',
];

export const TIPO_CONTRATO = [
  'INDEFINIDO',
  'PLAZO_FIJO',
  'OBRA_FAENA',
  'PART_TIME',
];

export const ESTADO_CONTRATO = [
  'BORRADOR',
  'VIGENTE',
  'MODIFICADO',
  'TERMINADO',
];

export const CAUSAL_TERMINO = {
  '161-1': 'Necesidades de la empresa',
  '161-2': 'Desahucio escrito del empleador',
  '159-1': 'Mutuo acuerdo',
  '159-2': 'Renuncia del trabajador',
  '159-3': 'Muerte del trabajador',
  '159-4': 'Vencimiento del plazo',
  '159-5': 'Conclusion del trabajo',
  '159-6': 'Caso fortuito o fuerza mayor',
  '160-1': 'Conductas indebidas de caracter grave',
  '160-2': 'Negociaciones incompatibles',
  '160-3': 'Inasistencia injustificada',
  '160-4': 'Abandono del trabajo',
  '160-5': 'Actos, omisiones o imprudencias temerarias',
  '160-6': 'Perjuicio material intencional',
  '160-7': 'Incumplimiento grave de obligaciones',
  '163-bis': 'Autodespido (despido indirecto)',
};

export const TIPO_PERMISO = {
  VACACIONES: 'Vacaciones',
  ADMINISTRATIVO: 'Permiso administrativo',
  MEDICO: 'Licencia medica',
  MATERNAL: 'Licencia maternal',
  PATERNAL: 'Licencia paternal',
  DUELO: 'Permiso por duelo',
  MATRIMONIO: 'Permiso por matrimonio',
  SINDICAL: 'Permiso sindical',
  CAPACITACION: 'Permiso por capacitacion',
  OTRO: 'Otro',
};

const { SUPER_ADMIN, SUPERVISOR, OWNER, ADMIN, WORKER } = ROLES;
const MANAGEMENT = [SUPER_ADMIN, SUPERVISOR, OWNER, ADMIN];
const ALL_ROLES = [SUPER_ADMIN, SUPERVISOR, OWNER, ADMIN, WORKER];
const OWNER_ADMIN = [SUPER_ADMIN, OWNER, ADMIN];

export const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    roles: ALL_ROLES,
  },
  {
    href: '/trabajadores',
    label: 'Trabajadores',
    icon: 'Users',
    roles: MANAGEMENT,
  },
  {
    href: '/contratos',
    label: 'Contratos',
    icon: 'FileText',
    roles: ALL_ROLES,
  },
  {
    href: '/liquidaciones',
    label: 'Liquidaciones',
    icon: 'Receipt',
    roles: ALL_ROLES,
    badgeKey: 'liquidacionesPendientes',
  },
  {
    href: '/cotizaciones',
    label: 'Cotizaciones',
    icon: 'Calculator',
    roles: MANAGEMENT,
  },
  {
    href: '/asistencia',
    label: 'Asistencia',
    icon: 'Clock',
    roles: ALL_ROLES,
  },
  {
    href: '/vacaciones',
    label: 'Vacaciones',
    icon: 'Palmtree',
    roles: ALL_ROLES,
    badgeKey: 'solicitudesPendientes',
  },
  {
    href: '/finiquitos',
    label: 'Finiquitos',
    icon: 'UserMinus',
    roles: MANAGEMENT,
  },
  {
    href: '/ley-karin',
    label: 'Ley Karin',
    icon: 'Shield',
    roles: MANAGEMENT,
    badgeKey: 'denunciasPendientes',
  },
  {
    href: '/compliance',
    label: 'Compliance',
    icon: 'ClipboardCheck',
    roles: MANAGEMENT,
  },
  {
    href: '/documentos',
    label: 'Documentos',
    icon: 'FolderOpen',
    roles: MANAGEMENT,
  },
  {
    href: '/configuracion',
    label: 'Configuracion',
    icon: 'Settings',
    roles: OWNER_ADMIN,
  },
  {
    href: '/planes',
    label: 'Planes',
    icon: 'CreditCard',
    roles: OWNER_ADMIN,
  },
];
