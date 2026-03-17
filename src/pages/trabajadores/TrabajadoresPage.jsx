import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatRut, formatDate } from '../../lib/format';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Plus, Search, Users } from 'lucide-react';

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/trabajadores');
        if (res.success) setTrabajadores(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  const filtered = trabajadores.filter(t =>
    `${t.nombre} ${t.apellidoPaterno} ${t.apellidoMaterno} ${t.rut}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Trabajadores</h1>
          <p className="text-sm text-gray-500">{trabajadores.length} registrados</p>
        </div>
        <Link to="/trabajadores/nuevo">
          <Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Nuevo trabajador</Button>
        </Link>
      </div>

      {trabajadores.length === 0 ? (
        <EmptyState icon={Users} title="Sin trabajadores" description="Agrega tu primer trabajador para comenzar" actionLabel="Agregar trabajador" actionHref="/trabajadores/nuevo" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm focus:border-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20"
                />
              </div>
            </div>
            <Table>
              <Thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>RUT</Th>
                  <Th>Cargo</Th>
                  <Th>Ingreso</Th>
                  <Th>Estado</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map(t => (
                  <Tr key={t.id}>
                    <Td>
                      <Link to={`/trabajadores/${t.id}`} className="font-medium text-[#1F4E79] hover:underline">
                        {t.nombre} {t.apellidoPaterno} {t.apellidoMaterno}
                      </Link>
                    </Td>
                    <Td>{formatRut(t.rut)}</Td>
                    <Td>{t.cargo || '—'}</Td>
                    <Td>{formatDate(t.fechaIngreso)}</Td>
                    <Td>
                      <Badge variant={t.estado === 'ACTIVO' ? 'success' : 'secondary'}>
                        {t.estado}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">Sin resultados para "{search}"</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
