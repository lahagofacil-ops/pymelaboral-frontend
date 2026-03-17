export const APP_NAME = 'PymeLaboral'

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  WORKER: 'WORKER',
}

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 20000,
    workers: 5,
    features: [
      'Hasta 5 trabajadores',
      'Liquidaciones de sueldo',
      'Contratos digitales',
      'Cotizaciones previsionales',
      'Soporte por email',
    ],
  },
  {
    id: 'profesional',
    name: 'Profesional',
    price: 50000,
    workers: 25,
    features: [
      'Hasta 25 trabajadores',
      'Todo lo de Starter',
      'Asistencia y vacaciones',
      'Portal del trabajador',
      'Compliance laboral',
      'Soporte prioritario',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 90000,
    workers: 100,
    features: [
      'Hasta 100 trabajadores',
      'Todo lo de Profesional',
      'Ley Karin',
      'Finiquitos automatizados',
      'Reportes avanzados',
      'Soporte dedicado',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    workers: null,
    features: [
      'Trabajadores ilimitados',
      'Todo lo de Business',
      'API personalizada',
      'Integraciones custom',
      'Account manager dedicado',
      'SLA garantizado',
    ],
  },
]

export const AFP_LIST = [
  'Capital',
  'Cuprum',
  'Habitat',
  'Modelo',
  'PlanVital',
  'ProVida',
  'Uno',
]

export const SALUD_LIST = [
  'Fonasa',
  'Banmedica',
  'Colmena',
  'Cruz Blanca',
  'Masvida',
  'Vida Tres',
  'Esencial',
]

export const REGIONES = [
  'Arica y Parinacota',
  'Tarapaca',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaiso',
  'Metropolitana de Santiago',
  "O'Higgins",
  'Maule',
  'Nuble',
  'Biobio',
  'La Araucania',
  'Los Rios',
  'Los Lagos',
  'Aysen',
  'Magallanes',
]

export const COMUNAS = {
  'Metropolitana de Santiago': [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea',
    'Nunoa', 'La Reina', 'Macul', 'Penalolen', 'La Florida',
    'San Joaquin', 'San Miguel', 'Pedro Aguirre Cerda', 'Lo Espejo', 'Cisterna',
    'El Bosque', 'San Bernardo', 'La Pintana', 'La Granja', 'San Ramon',
    'Puente Alto', 'Pirque', 'San Jose de Maipo',
    'Maipu', 'Cerrillos', 'Estacion Central', 'Quinta Normal', 'Lo Prado',
    'Pudahuel', 'Cerro Navia', 'Renca', 'Quilicura', 'Huechuraba',
    'Conchali', 'Independencia', 'Recoleta',
    'Colina', 'Lampa', 'Tiltil',
    'Buin', 'Paine', 'Calera de Tango',
    'Penaflor', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado',
    'Melipilla', 'Curacavi', 'Maria Pinto', 'San Pedro', 'Alhue',
  ],
  'Valparaiso': [
    'Valparaiso', 'Vina del Mar', 'Quilpue', 'Villa Alemana', 'Concon',
    'Quillota', 'La Calera', 'Limache', 'Olmue', 'San Antonio',
    'Cartagena', 'El Tabo', 'El Quisco', 'Algarrobo', 'Los Andes',
    'San Felipe', 'Putaendo', 'Catemu', 'Panquehue', 'Llay-Llay',
    'Casablanca', 'Juan Fernandez', 'Isla de Pascua',
  ],
  'Biobio': [
    'Concepcion', 'Talcahuano', 'Hualpen', 'San Pedro de la Paz', 'Chiguayante',
    'Coronel', 'Lota', 'Penco', 'Tome', 'Los Angeles',
    'Nacimiento', 'Mulchen', 'Arauco', 'Lebu', 'Canete',
  ],
}

export const TIPO_CONTRATO = [
  { value: 'INDEFINIDO', label: 'Indefinido' },
  { value: 'PLAZO_FIJO', label: 'Plazo Fijo' },
  { value: 'POR_OBRA', label: 'Por Obra o Faena' },
  { value: 'HONORARIOS', label: 'Honorarios' },
]

export const CAUSAL_TERMINO = [
  { value: 'MUTUO_ACUERDO', label: 'Mutuo acuerdo (Art. 159 N1)' },
  { value: 'RENUNCIA', label: 'Renuncia del trabajador (Art. 159 N2)' },
  { value: 'MUERTE', label: 'Muerte del trabajador (Art. 159 N3)' },
  { value: 'VENCIMIENTO_PLAZO', label: 'Vencimiento del plazo (Art. 159 N4)' },
  { value: 'FIN_TRABAJO', label: 'Conclusion del trabajo (Art. 159 N5)' },
  { value: 'CASO_FORTUITO', label: 'Caso fortuito (Art. 159 N6)' },
  { value: 'CONDUCTA_INDEBIDA', label: 'Conducta indebida (Art. 160 N1)' },
  { value: 'NEGOCIACIONES_PROHIBIDAS', label: 'Negociaciones prohibidas (Art. 160 N2)' },
  { value: 'INASISTENCIA', label: 'Inasistencia injustificada (Art. 160 N3)' },
  { value: 'ABANDONO', label: 'Abandono del trabajo (Art. 160 N4)' },
  { value: 'ACTOS_IMPRUDENCIA', label: 'Actos de imprudencia (Art. 160 N5)' },
  { value: 'PERJUICIO_MATERIAL', label: 'Perjuicio material (Art. 160 N6)' },
  { value: 'INCUMPLIMIENTO_GRAVE', label: 'Incumplimiento grave (Art. 160 N7)' },
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
