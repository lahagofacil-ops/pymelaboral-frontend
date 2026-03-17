import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';

const AFP_OPTIONS = [
  { value: 'CAPITAL', label: 'AFP Capital' },
  { value: 'CUPRUM', label: 'AFP Cuprum' },
  { value: 'HABITAT', label: 'AFP Habitat' },
  { value: 'MODELO', label: 'AFP Modelo' },
  { value: 'PLANVITAL', label: 'AFP PlanVital' },
  { value: 'PROVIDA', label: 'AFP ProVida' },
  { value: 'UNO', label: 'AFP Uno' },
];

const SALUD_OPTIONS = [
  { value: 'FONASA', label: 'Fonasa' },
  { value: 'BANMEDICA', label: 'Banmedica' },
  { value: 'COLMENA', label: 'Colmena' },
  { value: 'CONSALUD', label: 'Consalud' },
  { value: 'CRUZBLANCA', label: 'Cruz Blanca' },
  { value: 'MASVIDA', label: 'Mas Vida' },
  { value: 'VIDATRES', label: 'Vida Tres' },
];

export default function TrabajadorNuevoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rut: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    fechaNacimiento: '', sexo: '', nacionalidad: 'Chilena',
    direccion: '', comuna: '', telefono: '', email: '',
    fechaIngreso: '', afp: '', salud: '', isapre: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/trabajadores', form);
      if (res.success) navigate(`/trabajadores/${res.data.id}`);
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
          <h1 className="text-2xl font-bold text-[#1F4E79]">Nuevo Trabajador</h1>
          <p className="text-sm text-gray-500">Ingresa los datos del empleado</p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="RUT" value={form.rut} onChange={set('rut')} placeholder="12.345.678-9" required />
                <Input label="Nombre" value={form.nombre} onChange={set('nombre')} required />
                <Input label="Apellido Paterno" value={form.apellidoPaterno} onChange={set('apellidoPaterno')} required />
                <Input label="Apellido Materno" value={form.apellidoMaterno} onChange={set('apellidoMaterno')} />
                <Input label="Fecha de Nacimiento" type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} required />
                <Select label="Sexo" value={form.sexo} onChange={set('sexo')} placeholder="Seleccionar" options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} required />
                <Input label="Nacionalidad" value={form.nacionalidad} onChange={set('nacionalidad')} />
                <Input label="Direccion" value={form.direccion} onChange={set('direccion')} />
                <Input label="Comuna" value={form.comuna} onChange={set('comuna')} />
                <Input label="Telefono" value={form.telefono} onChange={set('telefono')} />
                <Input label="Email" type="email" value={form.email} onChange={set('email')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Datos laborales y prevision</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Fecha de Ingreso" type="date" value={form.fechaIngreso} onChange={set('fechaIngreso')} required />
                <Select label="AFP" value={form.afp} onChange={set('afp')} placeholder="Seleccionar AFP" options={AFP_OPTIONS} required />
                <Select label="Sistema de Salud" value={form.salud} onChange={set('salud')} placeholder="Seleccionar" options={SALUD_OPTIONS} required />
                {form.salud !== 'FONASA' && form.salud && (
                  <Input label="Isapre" value={form.isapre} onChange={set('isapre')} placeholder="Nombre de la Isapre" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button variant="secondary" type="submit" loading={loading}>Guardar trabajador</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
