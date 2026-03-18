export const REGIONES = [
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
  'Magallanes y la Antártica Chilena'
]

export const AFPS = [
  { value: 'CAPITAL', label: 'AFP Capital' },
  { value: 'CUPRUM', label: 'AFP Cuprum' },
  { value: 'HABITAT', label: 'AFP Habitat' },
  { value: 'MODELO', label: 'AFP Modelo' },
  { value: 'PLANVITAL', label: 'AFP PlanVital' },
  { value: 'PROVIDA', label: 'AFP ProVida' },
  { value: 'UNO', label: 'AFP Uno' }
]

export const PLANES = [
  { value: 'STARTER', label: 'Starter', precio: '$20.000/mes', trabajadores: 5 },
  { value: 'PROFESIONAL', label: 'Profesional', precio: '$50.000/mes', trabajadores: 25 },
  { value: 'BUSINESS', label: 'Business', precio: '$90.000/mes', trabajadores: 100 }
]

export const CAUSAL_TERMINO = [
  { value: 'ART159_N1', label: 'Art. 159 N°1 - Mutuo acuerdo de las partes' },
  { value: 'ART159_N2', label: 'Art. 159 N°2 - Renuncia del trabajador' },
  { value: 'ART159_N3', label: 'Art. 159 N°3 - Muerte del trabajador' },
  { value: 'ART159_N4', label: 'Art. 159 N°4 - Vencimiento del plazo convenido' },
  { value: 'ART159_N5', label: 'Art. 159 N°5 - Conclusión del trabajo o servicio' },
  { value: 'ART159_N6', label: 'Art. 159 N°6 - Caso fortuito o fuerza mayor' },
  { value: 'ART160_N1', label: 'Art. 160 N°1 - Conductas indebidas de carácter grave' },
  { value: 'ART160_N2', label: 'Art. 160 N°2 - Negociaciones incompatibles' },
  { value: 'ART160_N3', label: 'Art. 160 N°3 - No concurrencia sin causa justificada' },
  { value: 'ART160_N4', label: 'Art. 160 N°4 - Abandono del trabajo' },
  { value: 'ART160_N5', label: 'Art. 160 N°5 - Actos, omisiones o imprudencias temerarias' },
  { value: 'ART160_N6', label: 'Art. 160 N°6 - Perjuicio material causado intencionalmente' },
  { value: 'ART160_N7', label: 'Art. 160 N°7 - Incumplimiento grave de las obligaciones' },
  { value: 'ART161', label: 'Art. 161 - Necesidades de la empresa' }
]

export const TIPO_PERMISO = [
  { value: 'MEDICO', label: 'Médico' },
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'OTRO', label: 'Otro' }
]

export const TIPO_DOCUMENTO = [
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'ANEXO', label: 'Anexo' },
  { value: 'LIQUIDACION', label: 'Liquidación' },
  { value: 'FINIQUITO', label: 'Finiquito' },
  { value: 'PROTOCOLO_KARIN', label: 'Protocolo Karin' },
  { value: 'REGLAMENTO_INTERNO', label: 'Reglamento Interno' },
  { value: 'OTRO', label: 'Otro' }
]

export const ESTADO_COLORS = {
  PENDIENTE: 'warning',
  APROBADA: 'success',
  RECHAZADA: 'danger',
  PAGADA: 'success',
  VIGENTE: 'success',
  BORRADOR: 'neutral',
  RECIBIDA: 'warning',
  EN_INVESTIGACION: 'info',
  RESUELTA: 'success',
  DESESTIMADA: 'neutral'
}
