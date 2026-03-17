import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { Dialog } from '../../components/ui/Dialog';
import { StatCard } from '../../components/dashboard/StatCard';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { Umbrella, Plus, CheckCircle, XCircle, Calendar } from 'lucide-react';

const estadoBadge = { APROBADA: 'success', PENDIENTE: 'warning', RECHAZADA: 'destructive' };

export default function VacacionesPage() {
  const { user } = useAuth();
  const isWorker = user?.role === 'WORKER';
  const isManagement = ['SUPER_ADMIN', 'SUPERVISOR', 'OWNER', 'ADMIN'].includes(user?.role);
  const [vacaciones, setVacaciones] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fechaInicio: '', fechaFin: '', observacion: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/vacaciones');
      if (res.success) setVacaciones(res.data);
      if (isWorker && user?.trabajadorId) {
        const saldoRes = await api.get(`/api/vacaciones/saldo/${user.trabajadorId}`);
        if (saldoRes.success) setSaldo(saldoRes.data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [isWorker, user?.trabajadorId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const solicitar = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await api.post('/api/vacaciones', form);
      if (res.success) {
        setSuccess('Solicitud enviada correctamente');
        setShowForm(false);
        setForm({ fechaInicio: '', fechaFin: '', observacion: '' });
        fetchData();
      } else setError(res.error);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const aprobar = async (id) => {
    try {
      const res = await api.post(`/api/vacaciones/${id}/aprobar`);
      if (res.success) fetchData();
    } catch (e) { console.error(e); }
  };

  const rechazar = async (id) => {
    try {
      const res = await api.post(`/api/vacaciones/${id}/rechazar`);
      if (res.success) fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Vacaciones</h1>
          <p className="text-sm text-gray-500">Solicitudes y gestion de vacaciones</p>
        </div>
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Solicitar vacaciones
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Saldo worker */}
      {saldo && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Dias disponibles" value={`${saldo.diasPendientes} dias`} icon={Umbrella} iconColor="text-[#0F6E56]" />
          <StatCard title="Dias legales anuales" value={`${saldo.diasTotalesAnuales} dias`} icon={Calendar} />
          <StatCard title="Dias tomados" value={`${saldo.diasTomados || 0} dias`} icon={Calendar} iconColor="text-gray-500" />
        </div>
      )}

      {/* Tabla */}
      <Card>
        <CardHeader><CardTitle>Solicitudes</CardTitle></CardHeader>
        <CardContent>
          {vacaciones.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Sin solicitudes de vacaciones</p>
          ) : (
            <Table>
              <Thead>
                <tr>
                  {!isWorker && <Th>Trabajador</Th>}
                  <Th>Desde</Th>
                  <Th>Hasta</Th>
                  <Th>Dias</Th>
                  <Th>Estado</Th>
                  {isManagement && <Th>Acciones</Th>}
                </tr>
              </Thead>
              <Tbody>
                {vacaciones.map(v => (
                  <Tr key={v.id}>
                    {!isWorker && <Td className="font-medium">{v.trabajador?.nombre} {v.trabajador?.apellidoPaterno}</Td>}
                    <Td>{formatDate(v.fechaInicio)}</Td>
                    <Td>{formatDate(v.fechaFin)}</Td>
                    <Td>{v.diasHabiles} dias</Td>
                    <Td><Badge variant={estadoBadge[v.estado] || 'secondary'}>{v.estado}</Badge></Td>
                    {isManagement && (
                      <Td>
                        {v.estado === 'PENDIENTE' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => aprobar(v.id)} title="Aprobar">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => rechazar(v.id)} title="Rechazar">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog solicitud */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Solicitar Vacaciones">
        <form onSubmit={solicitar} className="space-y-4">
          <Input label="Fecha inicio" type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} required />
          <Input label="Fecha fin" type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} required />
          <Input label="Observacion (opcional)" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button variant="secondary" type="submit" loading={submitting}>Enviar solicitud</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
