import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatCLP, formatDate } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { UserMinus, Plus, Calculator } from 'lucide-react';

const causales = [
  { value: 'MUTUO_ACUERDO', label: 'Art. 159 N1 - Mutuo acuerdo' },
  { value: 'RENUNCIA', label: 'Art. 159 N2 - Renuncia del trabajador' },
  { value: 'VENCIMIENTO_PLAZO', label: 'Art. 159 N4 - Vencimiento del plazo' },
  { value: 'CONCLUSION_OBRA', label: 'Art. 159 N5 - Conclusion del trabajo' },
  { value: 'NECESIDADES_EMPRESA', label: 'Art. 161 - Necesidades de la empresa' },
  { value: 'DESAHUCIO', label: 'Art. 161 - Desahucio empleador' },
  { value: 'CONDUCTA_INDEBIDA', label: 'Art. 160 N1 - Conducta indebida grave' },
  { value: 'NEGOCIACIONES_PROHIBIDAS', label: 'Art. 160 N2 - Negociaciones prohibidas' },
  { value: 'INASISTENCIA', label: 'Art. 160 N3 - Inasistencia injustificada' },
  { value: 'ABANDONO', label: 'Art. 160 N4 - Abandono del trabajo' },
  { value: 'ACTOS_PERJUICIO', label: 'Art. 160 N5 - Actos, omisiones o imprudencias' },
  { value: 'PERJUICIO_MATERIAL', label: 'Art. 160 N6 - Perjuicio material' },
  { value: 'INCUMPLIMIENTO_GRAVE', label: 'Art. 160 N7 - Incumplimiento grave' },
];

export default function FiniquitosPage() {
  const [finiquitos, setFiniquitos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSimular, setShowSimular] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [form, setForm] = useState({ trabajadorId: '', causal: '', fechaTermino: '' });
  const [simulacion, setSimulacion] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [finRes, trabRes] = await Promise.all([
          api.get('/api/finiquitos'),
          api.get('/api/trabajadores'),
        ]);
        if (finRes.success) setFiniquitos(finRes.data);
        if (trabRes.success) setTrabajadores(trabRes.data.filter(t => t.estado === 'ACTIVO'));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const simular = async () => {
    setSimulating(true); setError(''); setSimulacion(null);
    try {
      const res = await api.post('/api/finiquitos/simular', form);
      if (res.success) setSimulacion(res.data);
      else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setSimulating(false); }
  };

  const crear = async () => {
    setSubmitting(true); setError('');
    try {
      const res = await api.post('/api/finiquitos', form);
      if (res.success) {
        setShowCrear(false); setShowSimular(false); setSimulacion(null);
        setForm({ trabajadorId: '', causal: '', fechaTermino: '' });
        const finRes = await api.get('/api/finiquitos');
        if (finRes.success) setFiniquitos(finRes.data);
      } else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;

  const estadoBadge = { FIRMADO: 'success', BORRADOR: 'warning', ANULADO: 'destructive' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Finiquitos</h1>
          <p className="text-sm text-gray-500">Terminacion de contratos de trabajo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSimular(true)}>
            <Calculator className="mr-2 h-4 w-4" /> Simular
          </Button>
          <Button variant="secondary" onClick={() => setShowCrear(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo finiquito
          </Button>
        </div>
      </div>

      {finiquitos.length === 0 ? (
        <EmptyState icon={UserMinus} title="Sin finiquitos" description="No hay finiquitos registrados" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Trabajador</Th>
                  <Th>Causal</Th>
                  <Th>Fecha termino</Th>
                  <Th>Monto total</Th>
                  <Th>Estado</Th>
                </tr>
              </Thead>
              <Tbody>
                {finiquitos.map(f => (
                  <Tr key={f.id}>
                    <Td className="font-medium">{f.trabajador?.nombre} {f.trabajador?.apellidoPaterno}</Td>
                    <Td className="max-w-[200px] truncate text-xs">{f.causal}</Td>
                    <Td>{formatDate(f.fechaTermino)}</Td>
                    <Td className="font-semibold">{formatCLP(f.montoTotal)}</Td>
                    <Td><Badge variant={estadoBadge[f.estado] || 'secondary'}>{f.estado}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Simular dialog */}
      <Dialog open={showSimular} onClose={() => { setShowSimular(false); setSimulacion(null); }} title="Simular Finiquito" className="max-w-xl">
        <div className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Select label="Trabajador" value={form.trabajadorId} onChange={set('trabajadorId')} placeholder="Seleccionar" options={trabajadores.map(t => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))} />
          <Select label="Causal" value={form.causal} onChange={set('causal')} placeholder="Seleccionar causal" options={causales} />
          <Input label="Fecha de termino" type="date" value={form.fechaTermino} onChange={set('fechaTermino')} />
          <Button onClick={simular} loading={simulating} className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> Calcular simulacion
          </Button>

          {simulacion && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Vacaciones proporcionales</span><span className="font-medium">{formatCLP(simulacion.vacacionesProporcionales)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Indemnizacion anos servicio</span><span className="font-medium">{formatCLP(simulacion.indemnizacionAnosServicio)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Indemnizacion sustitutiva</span><span className="font-medium">{formatCLP(simulacion.indemnizacionSustitutiva)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Remuneracion pendiente</span><span className="font-medium">{formatCLP(simulacion.remuneracionPendiente)}</span></div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#0F6E56]">
                <span>Total</span><span>{formatCLP(simulacion.montoTotal)}</span>
              </div>
              <Button variant="secondary" onClick={crear} loading={submitting} className="mt-2 w-full">
                Crear finiquito
              </Button>
            </div>
          )}
        </div>
      </Dialog>

      {/* Crear dialog */}
      <Dialog open={showCrear} onClose={() => setShowCrear(false)} title="Nuevo Finiquito">
        <div className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Select label="Trabajador" value={form.trabajadorId} onChange={set('trabajadorId')} placeholder="Seleccionar" options={trabajadores.map(t => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))} />
          <Select label="Causal" value={form.causal} onChange={set('causal')} placeholder="Seleccionar causal" options={causales} />
          <Input label="Fecha de termino" type="date" value={form.fechaTermino} onChange={set('fechaTermino')} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCrear(false)}>Cancelar</Button>
            <Button variant="secondary" onClick={crear} loading={submitting}>Crear finiquito</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
