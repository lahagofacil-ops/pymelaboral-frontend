import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatRut, formatDate, formatCLP } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft, FileText, DollarSign, Calendar } from 'lucide-react';

export default function TrabajadorDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/trabajadores/${id}`);
        if (res.success) setData(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;
  if (!data) return <div className="py-12 text-center text-gray-500">Trabajador no encontrado</div>;

  const t = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1F4E79]">{t.nombre} {t.apellidoPaterno} {t.apellidoMaterno}</h1>
          <p className="text-sm text-gray-500">{formatRut(t.rut)} · {t.cargo || 'Sin cargo'}</p>
        </div>
        <Badge variant={t.estado === 'ACTIVO' ? 'success' : 'secondary'}>{t.estado}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['Nombre', `${t.nombre} ${t.apellidoPaterno} ${t.apellidoMaterno || ''}`],
                ['RUT', formatRut(t.rut)],
                ['Fecha nacimiento', formatDate(t.fechaNacimiento)],
                ['Sexo', t.sexo === 'M' ? 'Masculino' : 'Femenino'],
                ['Nacionalidad', t.nacionalidad],
                ['Direccion', t.direccion],
                ['Comuna', t.comuna],
                ['Telefono', t.telefono],
                ['Email', t.email],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Datos laborales</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['Fecha ingreso', formatDate(t.fechaIngreso)],
                ['AFP', t.afp],
                ['Salud', t.salud],
                ['Isapre', t.isapre],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value || '—'}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex gap-2">
              <Link to={`/contratos?trabajadorId=${t.id}`}>
                <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4" /> Contratos</Button>
              </Link>
              <Link to={`/liquidaciones?trabajadorId=${t.id}`}>
                <Button variant="outline" size="sm"><DollarSign className="mr-1 h-4 w-4" /> Liquidaciones</Button>
              </Link>
              <Link to={`/vacaciones?trabajadorId=${t.id}`}>
                <Button variant="outline" size="sm"><Calendar className="mr-1 h-4 w-4" /> Vacaciones</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
