import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { ShieldAlert, Plus, FileText, AlertTriangle } from 'lucide-react';

const estadoBadge = { RECIBIDA: 'warning', EN_INVESTIGACION: 'default', RESUELTA: 'success', DESESTIMADA: 'secondary' };
const tipoDenuncia = [
  { value: 'ACOSO_LABORAL', label: 'Acoso laboral' },
  { value: 'ACOSO_SEXUAL', label: 'Acoso sexual' },
  { value: 'VIOLENCIA_TRABAJO', label: 'Violencia en el trabajo' },
];

export default function LeyKarinPage() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: '', descripcion: '', denuncianteNombre: '', denuncianteEmail: '' });
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/karin/denuncias');
        if (res.success) setDenuncias(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const crear = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await api.post('/api/karin/denuncias', form);
      if (res.success) {
        setSuccess('Denuncia registrada correctamente');
        setShowForm(false);
        setForm({ tipo: '', descripcion: '', denuncianteNombre: '', denuncianteEmail: '' });
        const denRes = await api.get('/api/karin/denuncias');
        if (denRes.success) setDenuncias(denRes.data);
      } else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const generarProtocolo = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/api/karin/protocolo/generar');
      if (res.success) setSuccess('Protocolo Ley Karin generado correctamente');
      else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setGenerating(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Ley Karin</h1>
          <p className="text-sm text-gray-500">Ley 21.643 - Prevencion de acoso y violencia laboral</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generarProtocolo} loading={generating}>
            <FileText className="mr-2 h-4 w-4" /> Generar protocolo
          </Button>
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nueva denuncia
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Alert variant="warning" title="Plazo legal">
        La investigacion debe completarse en un plazo maximo de 30 dias corridos (Art. 211-E CT).
      </Alert>

      {denuncias.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="Sin denuncias" description="No hay denuncias Ley Karin registradas" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Fecha</Th>
                  <Th>Tipo</Th>
                  <Th>Descripcion</Th>
                  <Th>Estado</Th>
                  <Th>Plazo</Th>
                </tr>
              </Thead>
              <Tbody>
                {denuncias.map(d => {
                  const diasRestantes = d.fechaLimite ? Math.ceil((new Date(d.fechaLimite) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                  return (
                    <Tr key={d.id}>
                      <Td>{formatDate(d.createdAt)}</Td>
                      <Td>{d.tipo?.replace(/_/g, ' ')}</Td>
                      <Td className="max-w-[250px] truncate">{d.descripcion}</Td>
                      <Td><Badge variant={estadoBadge[d.estado] || 'secondary'}>{d.estado}</Badge></Td>
                      <Td>
                        {diasRestantes !== null && d.estado !== 'RESUELTA' && d.estado !== 'DESESTIMADA' && (
                          <span className={`text-sm font-medium ${diasRestantes <= 5 ? 'text-red-600' : diasRestantes <= 15 ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {diasRestantes > 0 ? `${diasRestantes} dias` : 'Vencido'}
                          </span>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="Nueva Denuncia Ley Karin">
        <form onSubmit={crear} className="space-y-4">
          <Select label="Tipo" value={form.tipo} onChange={set('tipo')} placeholder="Seleccionar tipo" options={tipoDenuncia} required />
          <Textarea label="Descripcion de los hechos" value={form.descripcion} onChange={set('descripcion')} required />
          <Input label="Nombre del denunciante (opcional)" value={form.denuncianteNombre} onChange={set('denuncianteNombre')} />
          <Input label="Email del denunciante (opcional)" type="email" value={form.denuncianteEmail} onChange={set('denuncianteEmail')} />
          <p className="text-xs text-gray-400">La denuncia puede ser anonima. Los datos del denunciante se mantienen confidenciales.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button variant="secondary" type="submit" loading={submitting}>Registrar denuncia</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
