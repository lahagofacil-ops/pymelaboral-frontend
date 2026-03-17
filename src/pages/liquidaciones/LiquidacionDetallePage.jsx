import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCLP, formatPeriodo } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function LiquidacionDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/liquidaciones/${id}`);
        if (res.success) setData(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const aprobar = async () => {
    setApproving(true);
    try {
      const res = await api.post(`/api/liquidaciones/${id}/aprobar`);
      if (res.success) setData({ ...data, estado: 'APROBADA' });
    } catch (e) { console.error(e); }
    finally { setApproving(false); }
  };

  if (loading) return <Loader />;
  if (!data) return <div className="py-12 text-center text-gray-500">Liquidacion no encontrada</div>;

  const l = data;
  const estadoBadge = { APROBADA: 'success', BORRADOR: 'warning', RECHAZADA: 'destructive' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1F4E79]">Liquidacion {formatPeriodo(l.periodo)}</h1>
          <p className="text-sm text-gray-500">{l.trabajador?.nombre} {l.trabajador?.apellidoPaterno}</p>
        </div>
        <Badge variant={estadoBadge[l.estado] || 'secondary'}>{l.estado}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Haberes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Sueldo base</span><span className="font-medium">{formatCLP(l.sueldoBase)}</span></div>
              {l.gratificacion > 0 && <div className="flex justify-between"><span className="text-gray-500">Gratificacion</span><span className="font-medium">{formatCLP(l.gratificacion)}</span></div>}
              {l.horasExtraMonto > 0 && <div className="flex justify-between"><span className="text-gray-500">Horas extra ({l.horasExtra} hrs)</span><span className="font-medium">{formatCLP(l.horasExtraMonto)}</span></div>}
              {l.bonoAdicional > 0 && <div className="flex justify-between"><span className="text-gray-500">Bono adicional</span><span className="font-medium">{formatCLP(l.bonoAdicional)}</span></div>}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Imponible</span><span>{formatCLP(l.totalImponible)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Bruto</span><span>{formatCLP(l.sueldoBruto)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Descuentos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-red-600"><span className="text-gray-500">AFP</span><span>-{formatCLP(l.afpMonto)}</span></div>
              <div className="flex justify-between text-red-600"><span className="text-gray-500">Salud</span><span>-{formatCLP(l.saludMonto)}</span></div>
              <div className="flex justify-between text-red-600"><span className="text-gray-500">Seguro cesantia</span><span>-{formatCLP(l.seguroCesantia)}</span></div>
              {l.impuestoUnico > 0 && <div className="flex justify-between text-red-600"><span className="text-gray-500">Impuesto unico</span><span>-{formatCLP(l.impuestoUnico)}</span></div>}
              <div className="border-t pt-2 flex justify-between font-semibold text-red-600">
                <span>Total Descuentos</span><span>-{formatCLP(l.totalDescuentos)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#0F6E56]/30 bg-[#0F6E56]/5">
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <p className="text-sm text-gray-500">Sueldo Liquido</p>
            <p className="text-3xl font-bold text-[#0F6E56]">{formatCLP(l.sueldoLiquido)}</p>
          </div>
          {l.estado === 'BORRADOR' && (
            <Button variant="secondary" onClick={aprobar} loading={approving}>
              <CheckCircle className="mr-2 h-4 w-4" /> Aprobar liquidacion
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
