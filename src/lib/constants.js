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
  { value: 'MUTUO_ACUERDO', label: 'Art. 159 N°1 - Mutuo acuerdo de las partes' },
  { value: 'RENUNCIA', label: 'Art. 159 N°2 - Renuncia del trabajador' },
  { value: 'MUERTE', label: 'Art. 159 N°3 - Muerte del trabajador' },
  { value: 'VENCIMIENTO_PLAZO', label: 'Art. 159 N°4 - Vencimiento del plazo convenido' },
  { value: 'CONCLUSION_OBRA', label: 'Art. 159 N°5 - Conclusión del trabajo o servicio' },
  { value: 'CASO_FORTUITO', label: 'Art. 159 N°6 - Caso fortuito o fuerza mayor' },
  { value: 'CONDUCTA_INDEBIDA', label: 'Art. 160 N°1 - Conducta indebida de carácter grave' },
  { value: 'INASISTENCIA', label: 'Art. 160 N°3 - Inasistencias injustificadas' },
  { value: 'ABANDONO', label: 'Art. 160 N°4 - Abandono del trabajo' },
  { value: 'INCUMPLIMIENTO_GRAVE', label: 'Art. 160 N°7 - Incumplimiento grave de obligaciones' },
  { value: 'NECESIDADES_EMPRESA', label: 'Art. 161 - Necesidades de la empresa' },
  { value: 'DESAHUCIO', label: 'Art. 161 inc.2 - Desahucio del empleador' }
]

export const TIPO_PERMISO = [
  { value: 'MATRIMONIO', label: 'Matrimonio (5 días)' },
  { value: 'NACIMIENTO_HIJO', label: 'Nacimiento de hijo (5 días)' },
  { value: 'FALLECIMIENTO', label: 'Fallecimiento familiar (3-7 días)' },
  { value: 'MUDANZA', label: 'Mudanza (1 día)' },
  { value: 'EXAMEN_PREVENTIVO', label: 'Examen preventivo de salud' },
  { value: 'OTRO', label: 'Otro' }
]

export const TIPO_DOCUMENTO = [
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'ANEXO_CONTRATO', label: 'Anexo de Contrato' },
  { value: 'LIQUIDACION', label: 'Liquidación' },
  { value: 'FINIQUITO', label: 'Finiquito' },
  { value: 'CERTIFICADO_AFP', label: 'Certificado AFP' },
  { value: 'CERTIFICADO_SALUD', label: 'Certificado Salud' },
  { value: 'CEDULA_IDENTIDAD', label: 'Cédula de Identidad' },
  { value: 'CERTIFICADO_ANTECEDENTES', label: 'Certificado Antecedentes' },
  { value: 'CAPACITACION', label: 'Capacitación' },
  { value: 'ODI', label: 'Obligación de Informar (ODI)' },
  { value: 'LICENCIA_MEDICA', label: 'Licencia Médica' },
  { value: 'RIOHS', label: 'Reglamento Interno (RIOHS)' },
  { value: 'PROTOCOLO_KARIN', label: 'Protocolo Ley Karin' },
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
