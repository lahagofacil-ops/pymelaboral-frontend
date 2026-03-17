import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCLP } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { CLPInput } from '../../components/ui/CLPInput';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function LiquidacionNuevaPage() {
  const navigate = useNavigate();
  const [trabajadores, setTrabajadores] = useState([]);
  const [form, setForm] = useState({ trabajadorId: '', periodo: '', diasTrabajados: '30', horasExtra: '0', bonoAdicional: '0' });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/trabajadores');
        if (res.success) setTrabajadores(res.data.filter(t => t.estado === 'ACTIVO'));
      } catch (e) { console.error(e); }
    };
    fetch();
    // Default period: previous month
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    setForm(f => ({ ...f, periodo: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }));
  }, []);

  const set = (key) => (e) => { setForm({ ...form, [key]: e.target.value }); setPreview(null); };

  const calcular = async () => {
    setError('');
    setCalculating(true);
    try {
      const res = await api.post('/api/liquidaciones', {
        ...form,
        diasTrabajados: parseInt(form.diasTrabajados),
        horasExtra: parseInt(form.horasExtra),
        bonoAdicional: parseInt(form.bonoAdicional || '0'),
        preview: true,
      });
      if (res.success) setPreview(res.data);
      else setError(res.error);
    } catch (err) { setError(err.message); }
    finally { setCalculating(false); }
  };

  const confirmar = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/liquidaciones', {
        ...form,
        diasTrabajados: parseInt(form.diasTrabajados),
        horasExtra: parseInt(form.horasExtra),
        bonoAdicional: parseInt(form.bonoAdicional || '0'),
      });
      if (res.success) navigate(`/liquidaciones/${res.data.id}`);
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
          <h1 className="text-2xl font-bold text-[#1F4E79]">Nueva Liquidacion</h1>
          <p className="text-sm text-gray-500">Calcula la remuneracion mensual</p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Parametros</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select label="Trabajador" value={form.trabajadorId} onChange={set('trabajadorId')} placeholder="Seleccionar" options={trabajadores.map(t => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))} required />
              <Input label="Periodo" type="month" value={form.periodo} onChange={set('periodo')} required />
              <Input label="Dias trabajados" type="number" value={form.diasTrabajados} onChange={set('diasTrabajados')} min="0" max="31" />
              <Input label="Horas extra" type="number" value={form.horasExtra} onChange={set('horasExtra')} min="0" />
              <CLPInput label="Bono adicional" value={form.bonoAdicional} onChange={set('bonoAdicional')} />
              <Button onClick={calcular} loading={calculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" /> Calcular
              </Button>
            </div>
          </CardContent>
        </Card>

        {preview && (
          <Card>
            <CardHeader><CardTitle>Vista previa</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Sueldo base</span><span className="font-medium">{formatCLP(preview.sueldoBase)}</span></div>
                {preview.gratificacion > 0 && <div className="flex justify-between"><span className="text-gray-500">Gratificacion</span><span className="font-medium">{formatCLP(preview.gratificacion)}</span></div>}
                {preview.horasExtraMonto > 0 && <div className="flex justify-between"><span className="text-gray-500">Horas extra</span><span className="font-medium">{formatCLP(preview.horasExtraMonto)}</span></div>}
                {preview.bonoAdicional > 0 && <div className="flex justify-between"><span className="text-gray-500">Bono adicional</span><span className="font-medium">{formatCLP(preview.bonoAdicional)}</span></div>}
                <div className="border-t pt-2 flex justify-between font-semibold"><span>Total Imponible</span><span>{formatCLP(preview.totalImponible)}</span></div>

                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-red-600"><span className="text-gray-500">AFP ({preview.afpPorcentaje}%)</span><span>-{formatCLP(preview.afpMonto)}</span></div>
                  <div className="flex justify-between text-red-600"><span className="text-gray-500">Salud ({preview.saludPorcentaje}%)</span><span>-{formatCLP(preview.saludMonto)}</span></div>
                  <div className="flex justify-between text-red-600"><span className="text-gray-500">Seguro cesantia</span><span>-{formatCLP(preview.seguroCesantia)}</span></div>
                  {preview.impuestoUnico > 0 && <div className="flex justify-between text-red-600"><span className="text-gray-500">Impuesto unico</span><span>-{formatCLP(preview.impuestoUnico)}</span></div>}
                </div>

                <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#0F6E56]">
                  <span>Sueldo Liquido</span><span>{formatCLP(preview.sueldoLiquido)}</span>
                </div>

                <Button variant="secondary" onClick={confirmar} loading={loading} className="mt-4 w-full">
                  Confirmar y guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
