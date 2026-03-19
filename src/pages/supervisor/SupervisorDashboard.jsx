import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, ArrowRight, AlertTriangle, CheckCircle, Clock, FileText, MessageSquare, Send, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEmpresa } from '../../context/EmpresaContext'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'

const PLAN_COLORS = {
  STARTER: 'bg-blue-100 text-[#2563EB]',
  PROFESIONAL: 'bg-purple-100 text-purple-700',
  BUSINESS: 'bg-amber-100 text-amber-700'
}

const SEMAFORO_COLORS = {
  VERDE: { bg: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-700', label: 'Cumple' },
  AMARILLO: { bg: 'bg-yellow-400', ring: 'ring-yellow-200', text: 'text-yellow-700', label: 'Pendientes' },
  ROJO: { bg: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-700', label: 'Crítico' },
  ERROR: { bg: 'bg-gray-400', ring: 'ring-gray-200', text: 'text-gray-700', label: 'Error' },
}

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const { enterEmpresa } = useEmpresa()
  const navigate = useNavigate()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Detail panel
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  // Liquidaciones pendientes
  const [liquidaciones, setLiquidaciones] = useState([])
  const [loadingLiq, setLoadingLiq] = useState(false)
  const [approvingId, setApprovingId] = useState(null)

  // Notas
  const [notas, setNotas] = useState([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [savingNota, setSavingNota] = useState(false)

  useEffect(() => {
    fetchEmpresas()
  }, [])

  const fetchEmpresas = async () => {
    try {
      const res = await apiClient.get('/api/supervisora/empresas')
      if (res.success) {
        setEmpresas(Array.isArray(res.data) ? res.data : [])
      } else {
        setError(res.error || 'Error al cargar empresas')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectEmpresa = async (emp) => {
    setSelectedEmpresa(emp)
    setDetalle(null)
    setLiquidaciones([])
    setNotas([])
    setLoadingDetalle(true)

    try {
      const [detalleRes, liqRes, notasRes] = await Promise.all([
        apiClient.get(`/api/supervisora/empresas/${emp.empresaId}`),
        apiClient.get(`/api/supervisora/liquidaciones/pendientes?empresaId=${emp.empresaId}`),
        apiClient.get(`/api/supervisora/notas?empresaId=${emp.empresaId}`),
      ])

      if (detalleRes.success) setDetalle(detalleRes.data)
      if (liqRes.success) {
        const list = Array.isArray(liqRes.data) ? liqRes.data : []
        setLiquidaciones(list)
      }
      if (notasRes.success) {
        const list = Array.isArray(notasRes.data) ? notasRes.data : []
        setNotas(list)
      }
    } catch {
      setError('Error al cargar detalle')
    } finally {
      setLoadingDetalle(false)
    }
  }

  const handleEnterEmpresa = (emp) => {
    enterEmpresa(emp.empresaId, emp.razonSocial)
    navigate('/empresa')
  }

  const handleAprobarLiq = async (liqId) => {
    try {
      setApprovingId(liqId)
      const res = await apiClient.put(`/api/supervisora/liquidaciones/${liqId}/aprobar`)
      if (res.success) {
        setLiquidaciones(prev => prev.filter(l => l.id !== liqId))
        fetchEmpresas() // refresh counts
      } else {
        setError(res.error || 'Error al aprobar')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setApprovingId(null)
    }
  }

  const handleAprobarMasivo = async () => {
    if (!selectedEmpresa || liquidaciones.length === 0) return
    const periodo = liquidaciones[0]?.periodo
    if (!periodo) return

    try {
      setLoadingLiq(true)
      const res = await apiClient.put('/api/supervisora/liquidaciones/aprobar-masivo', {
        empresaId: selectedEmpresa.empresaId,
        periodo,
      })
      if (res.success) {
        setLiquidaciones([])
        fetchEmpresas()
      } else {
        setError(res.error || 'Error al aprobar masivo')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoadingLiq(false)
    }
  }

  const handleCrearNota = async () => {
    if (!nuevaNota.trim() || !selectedEmpresa) return
    try {
      setSavingNota(true)
      const res = await apiClient.post('/api/supervisora/notas', {
        empresaId: selectedEmpresa.empresaId,
        contenido: nuevaNota.trim(),
      })
      if (res.success) {
        const nota = res.data
        setNotas(prev => [nota, ...prev])
        setNuevaNota('')
      } else {
        setError(res.error || 'Error al crear nota')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSavingNota(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* LEFT: Empresa list */}
      <div className="w-96 flex-shrink-0 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#111827] mb-1">
          Hola, {user?.nombre || 'Supervisora'}
        </h1>
        <p className="text-sm text-[#6B7280] mb-4">{empresas.length} empresas asignadas</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#DC2626] rounded-lg p-3 mb-3 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
          </div>
        )}

        {empresas.length === 0 && !error && (
          <div className="bg-gray-50 border border-[#E5E7EB] rounded-lg p-8 text-center">
            <Building2 className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">No tienes empresas asignadas</p>
          </div>
        )}

        <div className="space-y-3">
          {empresas.map((emp) => {
            const sem = SEMAFORO_COLORS[emp.compliance?.semaforo] || SEMAFORO_COLORS.ERROR
            const isSelected = selectedEmpresa?.empresaId === emp.empresaId

            return (
              <div
                key={emp.empresaId}
                onClick={() => handleSelectEmpresa(emp)}
                className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
                  isSelected ? 'border-[#2563EB] ring-2 ring-blue-100 shadow-md' : 'border-[#E5E7EB] hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#111827] leading-tight flex-1 mr-2">{emp.razonSocial}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[emp.plan] || ''}`}>
                      {emp.plan}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {emp.stats?.trabajadoresActivos ?? 0}
                    </span>
                    {emp.stats?.liquidacionesPendientes > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        {emp.stats.liquidacionesPendientes} liq.
                      </span>
                    )}
                    {emp.stats?.denunciasVencidas > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Karin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${sem.bg}`} title={sem.label} />
                    <span className={`text-xs font-medium ${sem.text}`}>{emp.compliance?.score ?? '—'}%</span>
                  </div>
                </div>

                {emp.alertasCriticas?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {emp.alertasCriticas.slice(0, 2).map((a, i) => (
                      <p key={i} className="text-xs text-red-600 flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {a}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT: Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {!selectedEmpresa && (
          <div className="flex items-center justify-center h-full text-[#6B7280]">
            <div className="text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Selecciona una empresa para ver su detalle</p>
            </div>
          </div>
        )}

        {selectedEmpresa && loadingDetalle && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {selectedEmpresa && !loadingDetalle && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{selectedEmpresa.razonSocial}</h2>
                <p className="text-sm text-[#6B7280]">{selectedEmpresa.rut} — {selectedEmpresa.region || ''}</p>
              </div>
              <button
                onClick={() => handleEnterEmpresa(selectedEmpresa)}
                className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors text-sm cursor-pointer"
              >
                Entrar como Owner
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Compliance card */}
            {detalle?.compliance && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#111827]">Compliance</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${SEMAFORO_COLORS[detalle.compliance.semaforo]?.bg || 'bg-gray-400'}`} />
                    <span className="text-2xl font-bold text-[#111827]">{detalle.compliance.score}%</span>
                  </div>
                </div>
                {detalle.compliance.checklist && (
                  <div className="space-y-1.5">
                    {detalle.compliance.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        {item.cumple
                          ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          : <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        }
                        <div>
                          <span className={item.cumple ? 'text-[#374151]' : 'text-red-700'}>{item.item}</span>
                          <span className="text-xs text-[#9CA3AF] ml-2">{item.detalle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {detalle?.stats && (
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Trabajadores" value={detalle.stats.trabajadoresActivos} />
                <StatCard label="Contratos vigentes" value={detalle.stats.contratosVigentes} />
                <StatCard label="Liq. pendientes" value={detalle.stats.liquidacionesPendientes} warn={detalle.stats.liquidacionesPendientes > 0} />
              </div>
            )}

            {/* Denuncias Karin abiertas */}
            {detalle?.denunciasAbiertas?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Denuncias Karin Abiertas ({detalle.denunciasAbiertas.length})
                </h3>
                <div className="space-y-2">
                  {detalle.denunciasAbiertas.map((d) => (
                    <div key={d.id} className="flex justify-between text-sm">
                      <span className="text-red-700">{d.tipoAcoso} — {d.estado}</span>
                      <span className={`text-xs ${d.vencida ? 'text-red-600 font-bold' : 'text-[#6B7280]'}`}>
                        {d.vencida ? 'VENCIDA' : `Límite: ${d.fechaLimite ? new Date(d.fechaLimite).toLocaleDateString('es-CL') : '—'}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liquidaciones pendientes */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#111827] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Liquidaciones Pendientes ({liquidaciones.length})
                </h3>
                {liquidaciones.length > 0 && (
                  <button
                    onClick={handleAprobarMasivo}
                    disabled={loadingLiq}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                  >
                    {loadingLiq ? 'Aprobando...' : `Aprobar todas (${liquidaciones.length})`}
                  </button>
                )}
              </div>
              {liquidaciones.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No hay liquidaciones pendientes de aprobación</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {liquidaciones.map((liq) => (
                    <div key={liq.id} className="flex items-center justify-between text-sm bg-[#F9FAFB] rounded-lg px-3 py-2">
                      <div>
                        <span className="font-medium text-[#111827]">{liq.trabajador}</span>
                        <span className="text-[#6B7280] ml-2">{liq.periodo}</span>
                      </div>
                      <button
                        onClick={() => handleAprobarLiq(liq.id)}
                        disabled={approvingId === liq.id}
                        className="text-xs bg-[#2563EB] text-white px-2.5 py-1 rounded hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer"
                      >
                        {approvingId === liq.id ? '...' : 'Aprobar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <h3 className="font-semibold text-[#111827] flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" />
                Notas
              </h3>

              {/* Input nueva nota */}
              <div className="flex gap-2 mb-4">
                <textarea
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                  placeholder="Escribir una nota sobre esta empresa..."
                  className="flex-1 rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] min-h-[60px] resize-none"
                />
                <button
                  onClick={handleCrearNota}
                  disabled={savingNota || !nuevaNota.trim()}
                  className="self-end bg-[#2563EB] text-white p-2.5 rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer"
                  title="Enviar nota"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {notas.length === 0 ? (
                <p className="text-sm text-[#6B7280]">Sin notas aún</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notas.map((nota) => (
                    <div key={nota.id} className="bg-[#F9FAFB] rounded-lg px-3 py-2">
                      <p className="text-sm text-[#111827]">{nota.contenido}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {nota.createdAt ? new Date(nota.createdAt).toLocaleDateString('es-CL', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, warn = false }) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-[#E5E7EB]'}`}>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <p className={`text-xl font-bold ${warn ? 'text-amber-700' : 'text-[#111827]'}`}>{value ?? 0}</p>
    </div>
  )
}
