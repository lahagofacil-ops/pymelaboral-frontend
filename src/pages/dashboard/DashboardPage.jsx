import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatCLP, formatFecha } from '../../lib/format';
import { StatCard } from '../../components/dashboard/StatCard';
import { AlertCard } from '../../components/dashboard/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import {
  Users, DollarSign, Building2, FileText, Plus, ArrowRight,
  UserPlus, Calendar, Clock, Umbrella, CalendarDays, Briefcase,
} from 'lucide-react';

function WorkerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/dashboard/worker');
      if (res.success) setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Bienvenido, {user?.nombre || 'Usuario'}</h1>
          <p className="text-gray-500">Tu cuenta aun no esta vinculada a un trabajador</p>
        </div>
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-bold text-[#1F4E79]">Sin vinculacion</h2>
            <p className="max-w-md text-gray-500">Contacta al administrador de tu empresa para vincular tu cuenta.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F4E79]">Hola, {data.trabajador.nombre}</h1>
        <p className="text-gray-500">{data.trabajador.cargo} · Desde el {formatFecha(data.trabajador.fechaIngreso)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Ultimo sueldo liquido" value={data.ultimaLiquidacion ? formatCLP(data.ultimaLiquidacion.liquido) : '—'} subtitle={data.ultimaLiquidacion?.periodo || 'Sin liquidaciones'} icon={DollarSign} iconColor="text-[#0F6E56]" />
        <StatCard title="Vacaciones pendientes" value={data.vacaciones.esProporcional ? `${Math.round(data.vacaciones.diasProporcionales)} dias` : `${data.vacaciones.diasPendientes} dias`} subtitle={`De ${data.vacaciones.diasTotalesAnuales} anuales`} icon={Umbrella} />
        <StatCard title="Dias trabajados (mes)" value={String(data.asistenciaMes.diasTrabajados)} subtitle={data.asistenciaMes.horasExtra > 0 ? `${data.asistenciaMes.horasExtra} hrs extra` : 'Sin horas extra'} icon={CalendarDays} />
        <StatCard title="Sueldo base" value={formatCLP(data.trabajador.sueldoBase)} icon={Briefcase} />
      </div>

      {data.vacaciones.solicitudesPendientes > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-5 w-5 text-yellow-600" />
            <p className="flex-1 text-sm font-medium text-yellow-800">
              Tienes {data.vacaciones.solicitudesPendientes} solicitud{data.vacaciones.solicitudesPendientes > 1 ? 'es' : ''} de vacaciones pendiente{data.vacaciones.solicitudesPendientes > 1 ? 's' : ''}
            </p>
            <Link to="/vacaciones"><Button size="sm" variant="outline">Ver</Button></Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Acciones rapidas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: '/asistencia', icon: CalendarDays, color: 'text-[#1F4E79]', title: 'Marcar asistencia', sub: 'Registra tu entrada/salida' },
              { href: '/vacaciones', icon: Umbrella, color: 'text-[#0F6E56]', title: 'Solicitar vacaciones', sub: 'Revisa tu saldo y solicita dias' },
              { href: '/liquidaciones', icon: DollarSign, color: 'text-[#0F6E56]', title: 'Mis liquidaciones', sub: 'Historial de remuneraciones' },
              { href: '/contratos', icon: FileText, color: 'text-[#1F4E79]', title: 'Mi contrato', sub: 'Ver detalles de tu contrato' },
            ].map(a => (
              <Link key={a.href} to={a.href}>
                <Button variant="outline" className="flex h-auto w-full items-center justify-start gap-3 p-4">
                  <a.icon className={`h-5 w-5 ${a.color}`} />
                  <div className="text-left">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.sub}</p>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-blue-500" /> Proximos Feriados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.feriados && data.feriados.length > 0 ? (
              <div className="space-y-3">
                {data.feriados.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded bg-blue-100 text-blue-700">
                      <span className="text-xs font-bold">{new Date(f.fecha).getDate()}</span>
                      <span className="text-[10px]">{new Date(f.fecha).toLocaleDateString('es-CL', { month: 'short' })}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{f.nombre}</p>
                      {f.irrenunciable && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">Irrenunciable</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">Sin feriados proximos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/dashboard');
      if (res.success) setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loader />;

  const isEmpty = data && data.stats.trabajadoresActivos === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Bienvenido, {user?.nombre || 'Usuario'}</h1>
          <p className="text-gray-500">Comienza configurando tu empresa</p>
        </div>
        <Card className="border-dashed border-2 border-[#0F6E56]/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="mb-4 h-16 w-16 text-[#0F6E56]/50" />
            <h2 className="mb-2 text-xl font-bold text-[#1F4E79]">Agrega tu primer trabajador</h2>
            <p className="mb-6 max-w-md text-gray-500">Registra a tus empleados para comenzar a crear contratos, calcular liquidaciones y gestionar cumplimiento legal.</p>
            <Link to="/trabajadores/nuevo">
              <Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Agregar Trabajador</Button>
            </Link>
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: '1', t: 'Registra trabajadores', s: 'Ingresa datos personales y prevision' },
            { n: '2', t: 'Crea contratos', s: 'Wizard paso a paso con PDF' },
            { n: '3', t: 'Gestiona cumplimiento', s: 'Alertas automaticas y liquidaciones' },
          ].map(step => (
            <Card key={step.n} className="text-center">
              <CardContent className="py-6">
                <div className="mb-3 text-3xl font-bold text-[#1F4E79]">{step.n}</div>
                <p className="font-medium">{step.t}</p>
                <p className="text-xs text-gray-400">{step.s}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F4E79]">Bienvenido, {user?.nombre || 'Usuario'}</h1>
        <p className="text-gray-500">Resumen de tu empresa al {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {data && data.alertas && data.alertas.length > 0 && (
        <div className="space-y-3">
          {data.alertas.map((a, i) => <AlertCard key={i} {...a} />)}
        </div>
      )}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Trabajadores activos" value={String(data.stats.trabajadoresActivos)} icon={Users} />
          <StatCard title="Costo nomina mes" value={formatCLP(data.stats.costoNominaMes)} subtitle={new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })} icon={DollarSign} iconColor="text-[#0F6E56]" />
          <StatCard title="Cotizaciones pendientes" value={String(data.stats.cotizacionesPendientes)} icon={Building2} />
          <StatCard title="Contratos vigentes" value={String(data.stats.contratosVigentes)} icon={FileText} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-orange-500" /> Proximos Vencimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.vencimientos?.length > 0 ? (
                  <div className="space-y-3">
                    {data.vencimientos.map((v, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded bg-orange-100 text-orange-700">
                          <span className="text-xs font-bold">{new Date(v.fecha).getDate()}</span>
                          <span className="text-[10px]">{new Date(v.fecha).toLocaleDateString('es-CL', { month: 'short' })}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{v.nombre}</p>
                          <p className="text-xs text-gray-400">{v.tipo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">Sin vencimientos proximos</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-blue-500" /> Proximos Feriados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.feriados?.length > 0 ? (
                  <div className="space-y-3">
                    {data.feriados.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded bg-blue-100 text-blue-700">
                          <span className="text-xs font-bold">{new Date(f.fecha).getDate()}</span>
                          <span className="text-[10px]">{new Date(f.fecha).toLocaleDateString('es-CL', { month: 'short' })}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{f.nombre}</p>
                          {f.irrenunciable && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">Irrenunciable</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">Sin feriados proximos</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Acciones rapidas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: '/trabajadores/nuevo', icon: Plus, color: 'text-[#0F6E56]', title: 'Nuevo trabajador', sub: 'Agregar un empleado' },
              { href: '/contratos/nuevo', icon: FileText, color: 'text-[#1F4E79]', title: 'Nuevo contrato', sub: 'Crear contrato de trabajo' },
              { href: '/liquidaciones/nueva', icon: DollarSign, color: 'text-[#0F6E56]', title: 'Nueva liquidacion', sub: 'Calcular remuneracion mensual' },
              { href: '/compliance', icon: ArrowRight, color: 'text-[#1F4E79]', title: 'Ver compliance', sub: 'Estado de cumplimiento legal' },
            ].map(a => (
              <Link key={a.href} to={a.href}>
                <Button variant="outline" className="flex h-auto w-full items-center justify-start gap-3 p-4">
                  <a.icon className={`h-5 w-5 ${a.color}`} />
                  <div className="text-left">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.sub}</p>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'WORKER' ? <WorkerDashboard /> : <AdminDashboard />;
}
