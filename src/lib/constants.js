export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  WORKER: 'WORKER',
}

export const PLANS = {
  FREE: { name: 'Gratuito', maxWorkers: 5 },
  STARTER: { name: 'Starter', maxWorkers: 20 },
  PRO: { name: 'Profesional', maxWorkers: 50 },
  ENTERPRISE: { name: 'Empresa', maxWorkers: 999 },
}

export const AFP_OPTIONS = [
  { value: 'CAPITAL', label: 'AFP Capital' },
  { value: 'CUPRUM', label: 'AFP Cuprum' },
  { value: 'HABITAT', label: 'AFP Habitat' },
  { value: 'MODELO', label: 'AFP Modelo' },
  { value: 'PLANVITAL', label: 'AFP PlanVital' },
  { value: 'PROVIDA', label: 'AFP ProVida' },
  { value: 'UNO', label: 'AFP Uno' },
]

export const SALUD_OPTIONS = [
  { value: 'FONASA', label: 'Fonasa' },
  { value: 'BANMEDICA', label: 'Banmédica' },
  { value: 'COLMENA', label: 'Colmena Golden Cross' },
  { value: 'CONSALUD', label: 'Consalud' },
  { value: 'CRUZBLANCA', label: 'Cruz Blanca' },
  { value: 'MASVIDA', label: 'Nueva Masvida' },
  { value: 'VIDATRES', label: 'Vida Tres' },
]

export const REGIONES_CHILE = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  'O\'Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes y la Antártica Chilena',
]

export const TIPO_CONTRATO = [
  { value: 'INDEFINIDO', label: 'Indefinido' },
  { value: 'PLAZO_FIJO', label: 'Plazo Fijo' },
  { value: 'POR_OBRA', label: 'Por Obra o Faena' },
  { value: 'HONORARIOS', label: 'Honorarios' },
]

export const CAUSAL_TERMINO = [
  { value: 'MUTUO_ACUERDO', label: 'Mutuo acuerdo (Art. 159 N°1)' },
  { value: 'RENUNCIA', label: 'Renuncia del trabajador (Art. 159 N°2)' },
  { value: 'MUERTE', label: 'Muerte del trabajador (Art. 159 N°3)' },
  { value: 'VENCIMIENTO_PLAZO', label: 'Vencimiento del plazo (Art. 159 N°4)' },
  { value: 'FIN_TRABAJO', label: 'Conclusión del trabajo (Art. 159 N°5)' },
  { value: 'CASO_FORTUITO', label: 'Caso fortuito (Art. 159 N°6)' },
  { value: 'CONDUCTA_INDEBIDA', label: 'Conducta indebida (Art. 160 N°1)' },
  { value: 'NEGOCIACIONES_PROHIBIDAS', label: 'Negociaciones prohibidas (Art. 160 N°2)' },
  { value: 'INASISTENCIA', label: 'Inasistencia injustificada (Art. 160 N°3)' },
  { value: 'ABANDONO', label: 'Abandono del trabajo (Art. 160 N°4)' },
  { value: 'ACTOS_IMPRUDENCIA', label: 'Actos de imprudencia (Art. 160 N°5)' },
  { value: 'PERJUICIO_MATERIAL', label: 'Perjuicio material (Art. 160 N°6)' },
  { value: 'INCUMPLIMIENTO_GRAVE', label: 'Incumplimiento grave (Art. 160 N°7)' },
  { value: 'NECESIDADES_EMPRESA', label: 'Necesidades de la empresa (Art. 161)' },
  { value: 'DESAHUCIO', label: 'Desahucio escrito del empleador (Art. 161 inc. 2)' },
]

export const ESTADO = {
  ACTIVO: { label: 'Activo', color: 'success' },
  INACTIVO: { label: 'Inactivo', color: 'neutral' },
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  APROBADO: { label: 'Aprobado', color: 'success' },
  RECHAZADO: { label: 'Rechazado', color: 'danger' },
  BORRADOR: { label: 'Borrador', color: 'neutral' },
  ENVIADO: { label: 'Enviado', color: 'info' },
  PAGADO: { label: 'Pagado', color: 'success' },
  VENCIDO: { label: 'Vencido', color: 'danger' },
  CANCELADO: { label: 'Cancelado', color: 'neutral' },
}

export const NAV_ITEMS = {
  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
    { label: 'Empresas', path: '/admin/empresas', icon: 'Building2' },
    { label: 'Supervisoras', path: '/admin/supervisoras', icon: 'Shield' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'Users' },
  ],
  [ROLES.SUPERVISOR]: [
    { label: 'Dashboard', path: '/supervisor', icon: 'LayoutDashboard' },
    { label: 'Mis Empresas', path: '/supervisor/empresas', icon: 'Building2' },
  ],
  [ROLES.OWNER]: [
    { label: 'Dashboard', path: '/empresa', icon: 'LayoutDashboard' },
    { label: 'Trabajadores', path: '/empresa/trabajadores', icon: 'Users' },
    { label: 'Contratos', path: '/empresa/contratos', icon: 'FileText' },
    { label: 'Liquidaciones', path: '/empresa/liquidaciones', icon: 'DollarSign' },
    { label: 'Cotizaciones', path: '/empresa/cotizaciones', icon: 'Receipt' },
    { label: 'Asistencia', path: '/empresa/asistencia', icon: 'Clock' },
    { label: 'Vacaciones', path: '/empresa/vacaciones', icon: 'Palmtree' },
    { label: 'Permisos', path: '/empresa/permisos', icon: 'CalendarCheck' },
    { label: 'Finiquitos', path: '/empresa/finiquitos', icon: 'FileX' },
    { label: 'Ley Karin', path: '/empresa/karin', icon: 'AlertTriangle' },
    { label: 'Documentos', path: '/empresa/documentos', icon: 'FolderOpen' },
    { label: 'Compliance', path: '/empresa/compliance', icon: 'ShieldCheck' },
    { label: 'Configuración', path: '/empresa/configuracion', icon: 'Settings' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/empresa', icon: 'LayoutDashboard' },
    { label: 'Trabajadores', path: '/empresa/trabajadores', icon: 'Users' },
    { label: 'Contratos', path: '/empresa/contratos', icon: 'FileText' },
    { label: 'Liquidaciones', path: '/empresa/liquidaciones', icon: 'DollarSign' },
    { label: 'Cotizaciones', path: '/empresa/cotizaciones', icon: 'Receipt' },
    { label: 'Asistencia', path: '/empresa/asistencia', icon: 'Clock' },
    { label: 'Vacaciones', path: '/empresa/vacaciones', icon: 'Palmtree' },
    { label: 'Permisos', path: '/empresa/permisos', icon: 'CalendarCheck' },
    { label: 'Finiquitos', path: '/empresa/finiquitos', icon: 'FileX' },
    { label: 'Ley Karin', path: '/empresa/karin', icon: 'AlertTriangle' },
    { label: 'Documentos', path: '/empresa/documentos', icon: 'FolderOpen' },
    { label: 'Compliance', path: '/empresa/compliance', icon: 'ShieldCheck' },
    { label: 'Configuración', path: '/empresa/configuracion', icon: 'Settings' },
  ],
  [ROLES.WORKER]: [
    { label: 'Mi Portal', path: '/portal', icon: 'Home' },
    { label: 'Mis Liquidaciones', path: '/portal/liquidaciones', icon: 'DollarSign' },
    { label: 'Mi Contrato', path: '/portal/contrato', icon: 'FileText' },
    { label: 'Mis Vacaciones', path: '/portal/vacaciones', icon: 'Palmtree' },
    { label: 'Asistencia', path: '/portal/asistencia', icon: 'Clock' },
  ],
}
