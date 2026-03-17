import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/dashboard/StatCard';
import { Loader } from '../../components/ui/Loader';
import { Building2, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

const complianceColor = (score) => {
  if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Cumple', badge: 'success' };
  if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Parcial', badge: 'warning' };
  return { bg: 'bg-red-500', text: 'text-red-700', label: 'Crítico', badge: 'destructive' };
};

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/supervisor/empresas');
      if (res.success) setEmpresas(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel Supervisor</h1>
        <p className="text-sm text-gray-500">Empresas asignadas a {user?.nombre || 'ti'}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard title="Empresas asignadas" value={String(empresas.length)} icon={Building2} iconColor="text-[#2563EB]" />
        <StatCard title="Trabajadores totales" value={String(empresas.reduce((sum, e) => sum + (e.trabajadoresCount || 0), 0))} icon={Users} iconColor="text-[#2563EB]" />
        <StatCard title="Alertas activas" value={String(empresas.reduce((sum, e) => sum + (e.alertasCount || 0), 0))} icon={AlertTriangle} iconColor="text-amber-600" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {empresas.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">No tienes empresas asignadas</p>
            </CardContent>
          </Card>
        ) : (
          empresas.map(e => {
            const score = e.complianceScore ?? 75;
            const c = complianceColor(score);
            return (
              <Card key={e.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/dashboard?empresaId=${e.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{e.razonSocial}</h3>
                      <p className="text-xs text-gray-500">{e.rut}</p>
                    </div>
                    <Badge variant={c.badge}>{c.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {e.trabajadoresCount || 0}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> {score}%</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${score}%` }} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
