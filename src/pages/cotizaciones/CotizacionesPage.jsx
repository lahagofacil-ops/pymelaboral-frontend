import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatCLP, formatPeriodo } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { StatCard } from '../../components/dashboard/StatCard';
import { Building2, RefreshCw, CheckCircle, DollarSign, AlertTriangle } from 'lucide-react';

const estadoBadge = { PAGADA: 'success', PENDIENTE: 'warning', ATRASADA: 'destructive' };

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [cotRes, resRes] = await Promise.all([
        api.get('/api/cotizaciones'),
        api.get('/api/cotizaciones/resumen'),
      ]);
      if (cotRes.success) setCotizaciones(cotRes.data);
      if (resRes.success) setResumen(resRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const generar = async () => {
    setGenerating(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/api/cotizaciones/generar');
      if (res.success) { setSuccess(`Se generaron ${res.data.count || 0} cotizaciones`); fetchData(); }
      else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setGenerating(false); }
  };

  const marcarPagada = async (id) => {
    try {
      const res = await api.post(`/api/cotizaciones/${id}/marcar-pagada`);
      if (res.success) fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Cotizaciones Previsionales</h1>
          <p className="text-sm text-gray-500">Gestion de cotizaciones AFP, Salud y Seguro Cesantia</p>
        </div>
        <Button variant="secondary" onClick={generar} loading={generating}>
          <RefreshCw className="mr-2 h-4 w-4" /> Generar cotizaciones
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {resumen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total a pagar" value={formatCLP(resumen.totalPendiente)} icon={DollarSign} iconColor="text-[#0F6E56]" />
          <StatCard title="Cotizaciones pendientes" value={String(resumen.pendientes)} icon={Building2} />
          <StatCard title="Cotizaciones pagadas" value={String(resumen.pagadas)} icon={CheckCircle} iconColor="text-green-600" />
          {resumen.atrasadas > 0 && <StatCard title="Atrasadas" value={String(resumen.atrasadas)} icon={AlertTriangle} iconColor="text-red-600" />}
        </div>
      )}

      {cotizaciones.length === 0 ? (
        <EmptyState icon={Building2} title="Sin cotizaciones" description="Genera las cotizaciones del mes" actionLabel="Generar" onAction={generar} />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Trabajador</Th>
                  <Th>Periodo</Th>
                  <Th>AFP</Th>
                  <Th>Salud</Th>
                  <Th>Seg. Cesantia</Th>
                  <Th>Total</Th>
                  <Th>Estado</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {cotizaciones.map(c => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.trabajador?.nombre} {c.trabajador?.apellidoPaterno}</Td>
                    <Td>{formatPeriodo(c.periodo)}</Td>
                    <Td>{formatCLP(c.afpMonto)}</Td>
                    <Td>{formatCLP(c.saludMonto)}</Td>
                    <Td>{formatCLP(c.seguroCesantia)}</Td>
                    <Td className="font-semibold">{formatCLP(c.totalCotizacion)}</Td>
                    <Td><Badge variant={estadoBadge[c.estadoPrevired] || 'secondary'}>{c.estadoPrevired}</Badge></Td>
                    <Td>
                      {c.estadoPrevired !== 'PAGADA' && (
                        <Button variant="ghost" size="sm" onClick={() => marcarPagada(c.id)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
