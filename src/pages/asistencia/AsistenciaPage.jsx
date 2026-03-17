import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { StatCard } from '../../components/dashboard/StatCard';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { CalendarDays, Clock, LogIn, LogOut, CheckCircle } from 'lucide-react';

export default function AsistenciaPage() {
  const { user } = useAuth();
  const isWorker = user?.role === 'WORKER';
  const [registros, setRegistros] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [regRes, resRes] = await Promise.all([
        api.get('/api/asistencia'),
        api.get('/api/asistencia/resumen'),
      ]);
      if (regRes.success) setRegistros(regRes.data);
      if (resRes.success) setResumen(resRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const marcar = async (tipo) => {
    setMarking(true); setMessage(null);
    try {
      const res = await api.post('/api/asistencia/marcar', { tipo });
      if (res.success) {
        setMessage({ type: 'success', text: `${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada correctamente` });
        fetchData();
      } else {
        setMessage({ type: 'error', text: res.error });
      }
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
    finally { setMarking(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Asistencia</h1>
          <p className="text-sm text-gray-500">Control de asistencia y horas trabajadas</p>
        </div>
      </div>

      {message && <Alert variant={message.type === 'success' ? 'success' : 'error'}>{message.text}</Alert>}

      {/* Worker: Marcar buttons */}
      {isWorker && (
        <Card className="border-[#1F4E79]/20">
          <CardContent className="flex items-center justify-center gap-4 py-8">
            <Button variant="secondary" size="lg" onClick={() => marcar('ENTRADA')} loading={marking}>
              <LogIn className="mr-2 h-5 w-5" /> Marcar Entrada
            </Button>
            <Button variant="outline" size="lg" onClick={() => marcar('SALIDA')} loading={marking}>
              <LogOut className="mr-2 h-5 w-5" /> Marcar Salida
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resumen */}
      {resumen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Dias trabajados" value={String(resumen.diasTrabajados || 0)} icon={CalendarDays} />
          <StatCard title="Horas totales" value={String(resumen.horasTotales || 0)} icon={Clock} />
          <StatCard title="Horas extra" value={String(resumen.horasExtra || 0)} icon={Clock} iconColor="text-[#0F6E56]" />
          <StatCard title="Inasistencias" value={String(resumen.inasistencias || 0)} icon={CalendarDays} iconColor="text-red-500" />
        </div>
      )}

      {/* Tabla registros */}
      <Card>
        <CardHeader><CardTitle>Registros del mes</CardTitle></CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Sin registros de asistencia</p>
          ) : (
            <Table>
              <Thead>
                <tr>
                  {!isWorker && <Th>Trabajador</Th>}
                  <Th>Fecha</Th>
                  <Th>Entrada</Th>
                  <Th>Salida</Th>
                  <Th>Horas</Th>
                  <Th>Estado</Th>
                </tr>
              </Thead>
              <Tbody>
                {registros.map(r => (
                  <Tr key={r.id}>
                    {!isWorker && <Td className="font-medium">{r.trabajador?.nombre} {r.trabajador?.apellidoPaterno}</Td>}
                    <Td>{formatDate(r.fecha)}</Td>
                    <Td>{r.horaEntrada || '—'}</Td>
                    <Td>{r.horaSalida || '—'}</Td>
                    <Td>{r.horasTrabajadas ? `${r.horasTrabajadas}h` : '—'}</Td>
                    <Td>
                      <Badge variant={r.estado === 'PRESENTE' ? 'success' : r.estado === 'AUSENTE' ? 'destructive' : 'warning'}>
                        {r.estado}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
