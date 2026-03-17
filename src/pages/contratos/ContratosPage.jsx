import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatDate, formatCLP } from '../../lib/format';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Plus, FileText } from 'lucide-react';

const estadoBadge = {
  VIGENTE: 'success',
  BORRADOR: 'warning',
  TERMINADO: 'secondary',
};

export default function ContratosPage() {
  const [searchParams] = useSearchParams();
  const trabajadorId = searchParams.get('trabajadorId');
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = trabajadorId ? `/api/contratos?trabajadorId=${trabajadorId}` : '/api/contratos';
        const res = await api.get(url);
        if (res.success) setContratos(res.data);
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
          <h1 className="text-2xl font-bold text-[#1F4E79]">Contratos</h1>
          <p className="text-sm text-gray-500">{contratos.length} contratos</p>
        </div>
        <Link to="/contratos/nuevo">
          <Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Nuevo contrato</Button>
        </Link>
      </div>

      {contratos.length === 0 ? (
        <EmptyState icon={FileText} title="Sin contratos" description="Crea el primer contrato de trabajo" actionLabel="Crear contrato" actionHref="/contratos/nuevo" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Trabajador</Th>
                  <Th>Tipo</Th>
                  <Th>Cargo</Th>
                  <Th>Sueldo Base</Th>
                  <Th>Inicio</Th>
                  <Th>Estado</Th>
                </tr>
              </Thead>
              <Tbody>
                {contratos.map(c => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.trabajador?.nombre} {c.trabajador?.apellidoPaterno}</Td>
                    <Td>{c.tipo === 'INDEFINIDO' ? 'Indefinido' : c.tipo === 'PLAZO_FIJO' ? 'Plazo Fijo' : c.tipo}</Td>
                    <Td>{c.cargo || '—'}</Td>
                    <Td>{formatCLP(c.sueldoBase)}</Td>
                    <Td>{formatDate(c.fechaInicio)}</Td>
                    <Td><Badge variant={estadoBadge[c.estado] || 'secondary'}>{c.estado}</Badge></Td>
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
