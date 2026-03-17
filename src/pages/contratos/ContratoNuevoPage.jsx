import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CLPInput } from '../../components/ui/CLPInput';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';

export default function ContratoNuevoPage() {
  const navigate = useNavigate();
  const [trabajadores, setTrabajadores] = useState([]);
  const [form, setForm] = useState({
    trabajadorId: '', tipo: '', cargo: '', sueldoBase: '',
    fechaInicio: '', fechaTermino: '', jornadaSemanal: '42',
    gratificacion: 'ART50',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/trabajadores');
        if (res.success) setTrabajadores(res.data.filter(t => t.estado === 'ACTIVO'));
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, sueldoBase: parseInt(form.sueldoBase), jornadaSemanal: parseInt(form.jornadaSemanal) };
      if (form.tipo !== 'PLAZO_FIJO') delete payload.fechaTermino;
      const res = await api.post('/api/contratos', payload);
      if (res.success) navigate('/contratos');
      else setError(res.error);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Nuevo Contrato</h1>
          <p className="text-sm text-gray-500">Crea un contrato de trabajo</p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Datos del contrato</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Trabajador" value={form.trabajadorId} onChange={set('trabajadorId')} placeholder="Seleccionar trabajador" options={trabajadores.map(t => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))} required />
              <Select label="Tipo de contrato" value={form.tipo} onChange={set('tipo')} placeholder="Seleccionar" options={[{ value: 'INDEFINIDO', label: 'Indefinido' }, { value: 'PLAZO_FIJO', label: 'Plazo Fijo' }, { value: 'POR_OBRA', label: 'Por Obra o Faena' }]} required />
              <Input label="Cargo" value={form.cargo} onChange={set('cargo')} required />
              <CLPInput label="Sueldo Base" value={form.sueldoBase} onChange={set('sueldoBase')} required />
              <Input label="Fecha de Inicio" type="date" value={form.fechaInicio} onChange={set('fechaInicio')} required />
              {form.tipo === 'PLAZO_FIJO' && (
                <Input label="Fecha de Termino" type="date" value={form.fechaTermino} onChange={set('fechaTermino')} required />
              )}
              <Input label="Jornada semanal (horas)" type="number" value={form.jornadaSemanal} onChange={set('jornadaSemanal')} min="1" max="45" />
              <Select label="Gratificacion" value={form.gratificacion} onChange={set('gratificacion')} options={[{ value: 'ART50', label: 'Art. 50 - Tope 25% mensual' }, { value: 'ART47', label: 'Art. 47 - Reparto utilidades' }]} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="secondary" type="submit" loading={loading}>Crear contrato</Button>
        </div>
      </form>
    </div>
  );
}
