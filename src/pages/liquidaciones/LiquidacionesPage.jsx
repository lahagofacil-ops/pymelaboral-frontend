import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCLP, formatPeriodo } from '../../lib/format';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Plus, DollarSign, Eye } from 'lucide-react';

const estadoBadge = { APROBADA: 'success', BORRADOR: 'warning', RECHAZADA: 'destructive' };

export default function LiquidacionesPage() {
  const [searchParams] = useSearchParams();
  const trabajadorId = searchParams.get('trabajadorId');
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = trabajadorId ? `/api/liquidaciones?trabajadorId=${trabajadorId}` : '/api/liquidaciones';
        const res = await api.get(url);
        if (res.success) setLiquidaciones(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [trabajadorId]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Liquidaciones</h1>
          <p className="text-sm text-gray-500">{liquidaciones.length} registros</p>
        </div>
        <Link to="/liquidaciones/nueva">
          <Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Nueva liquidacion</Button>
        </Link>
      </div>

      {liquidaciones.length === 0 ? (
        <EmptyState icon={DollarSign} title="Sin liquidaciones" description="Genera la primera liquidacion de sueldo" actionLabel="Crear liquidacion" actionHref="/liquidaciones/nueva" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Trabajador</Th>
                  <Th>Periodo</Th>
                  <Th>Sueldo Bruto</Th>
                  <Th>Descuentos</Th>
                  <Th>Liquido</Th>
                  <Th>Estado</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {liquidaciones.map(l => (
                  <Tr key={l.id}>
                    <Td className="font-medium">{l.trabajador?.nombre} {l.trabajador?.apellidoPaterno}</Td>
                    <Td>{formatPeriodo(l.periodo)}</Td>
                    <Td>{formatCLP(l.sueldoBruto)}</Td>
                    <Td className="text-red-600">{formatCLP(l.totalDescuentos)}</Td>
                    <Td className="font-semibold text-[#0F6E56]">{formatCLP(l.sueldoLiquido)}</Td>
                    <Td><Badge variant={estadoBadge[l.estado] || 'secondary'}>{l.estado}</Badge></Td>
                    <Td>
                      <Link to={`/liquidaciones/${l.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
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
