import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/dashboard/StatCard';
import { Loader } from '../../components/ui/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { Building2, Users, DollarSign, BarChart3, Activity, MessageCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      if (res.success) setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loader />;

  // Fallback data if API not ready
  const stats = data?.stats || { empresas: 0, usuarios: 0, trabajadores: 0, ingresosEstimados: 0 };
  const empresas = data?.empresas || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-sm text-gray-500">Vista global de todas las empresas registradas</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Empresas activas" value={String(stats.empresas)} icon={Building2} iconColor="text-[#2563EB]" />
        <StatCard title="Usuarios totales" value={String(stats.usuarios)} icon={Users} iconColor="text-[#2563EB]" />
        <StatCard title="Trabajadores" value={String(stats.trabajadores)} icon={Activity} iconColor="text-emerald-600" />
        <StatCard title="Consultas IA hoy" value={String(stats.consultasIA || 0)} icon={MessageCircle} iconColor="text-purple-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#2563EB]" /> Empresas registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {empresas.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Sin empresas registradas aún</p>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Empresa</Th>
                  <Th>RUT</Th>
                  <Th>Plan</Th>
                  <Th>Trabajadores</Th>
                  <Th>Estado</Th>
                </tr>
              </Thead>
              <Tbody>
                {empresas.map(e => (
                  <Tr key={e.id} onClick={() => window.location.href = `/admin/empresa/${e.id}`} className="cursor-pointer">
                    <Td className="font-medium">{e.razonSocial}</Td>
                    <Td className="text-gray-500">{e.rut}</Td>
                    <Td><Badge variant={e.plan === 'PROFESIONAL' ? 'default' : 'secondary'}>{e.plan}</Badge></Td>
                    <Td>{e._count?.trabajadores || 0}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-500">Activa</span>
                      </span>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
