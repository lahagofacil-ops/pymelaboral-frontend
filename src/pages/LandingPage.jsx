import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SalesChatWidget } from '../components/chat/SalesChatWidget';
import {
  DollarSign, FileText, Building2, CalendarDays, Umbrella, ShieldAlert,
  CheckCircle, ArrowRight, Users, BarChart3, Shield, Zap, X, Loader2
} from 'lucide-react';

const WEBHOOK_URL = import.meta.env.VITE_SALES_CHAT_WEBHOOK;

const features = [
  { icon: DollarSign, title: 'Liquidaciones', desc: 'Calcula sueldos con 100% precisión legal. AFP, salud, gratificación y descuentos automáticos.' },
  { icon: FileText, title: 'Contratos', desc: 'Genera contratos de trabajo en minutos. Plazo fijo, indefinido y part-time con cláusulas legales.' },
  { icon: Building2, title: 'Cotizaciones', desc: 'Gestiona cotizaciones previsionales AFP, Fonasa/Isapre y seguro cesantía. Alertas de vencimiento.' },
  { icon: CalendarDays, title: 'Asistencia', desc: 'Control de asistencia digital. Registro de entrada/salida, horas extra y resumen mensual.' },
  { icon: Umbrella, title: 'Vacaciones', desc: 'Solicitudes online, saldo automático, vacaciones progresivas y aprobación en un clic.' },
  { icon: ShieldAlert, title: 'Ley Karin', desc: 'Protocolo obligatorio Ley 21.643. Canal de denuncias anónimo y seguimiento de investigaciones.' },
];

const stats = [
  { value: '500+', label: 'Empresas activas' },
  { value: '15.000+', label: 'Trabajadores gestionados' },
  { value: '99.9%', label: 'Precisión en cálculos' },
  { value: '24/7', label: 'Asistente IA disponible' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', phone: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSent, setDemoSent] = useState(false);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'demo_request',
            name: demoForm.name,
            phone: demoForm.phone,
            timestamp: new Date().toISOString(),
          }),
        });
      }
      setDemoSent(true);
      setTimeout(() => {
        setDemoOpen(false);
        setDemoSent(false);
        setDemoForm({ name: '', phone: '' });
      }, 3000);
    } catch {
      setDemoSent(true);
      setTimeout(() => {
        setDemoOpen(false);
        setDemoSent(false);
        setDemoForm({ name: '', phone: '' });
      }, 3000);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-bold text-white">PL</div>
            <span className="text-lg font-bold text-gray-900">PymeLaboral</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1E40AF] transition-colors">
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Iniciar Sesión
                </Link>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1E40AF] transition-colors"
                >
                  Solicita una demo
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#1e3a8a] px-4 py-20 sm:py-28 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-blue-100 backdrop-blur-sm">
            <Zap className="h-4 w-4" /> Plataforma actualizada 2026 — Jornada 40 hrs incluida
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Gestión laboral<br className="hidden sm:block" /> simple para PYMEs chilenas
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100 sm:text-lg md:text-xl">
            Liquidaciones, contratos, cotizaciones, vacaciones y cumplimiento legal en una sola plataforma. Con asistente IA experto en derecho laboral.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#2563EB] shadow-lg hover:bg-blue-50 transition-colors">
                Ir al Dashboard <ArrowRight className="ml-2 inline h-5 w-5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#2563EB] shadow-lg hover:bg-blue-50 transition-colors"
                >
                  Solicita una demo <ArrowRight className="ml-2 inline h-5 w-5" />
                </button>
                <Link to="/login" className="w-full sm:w-auto rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
          <p className="mt-4 text-sm text-blue-200">Te contactamos en menos de 24 horas · Demo personalizada sin costo</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 md:gap-8 md:py-10">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#2563EB] sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Todo lo que necesitas para cumplir la ley</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 sm:text-lg">
              Módulos diseñados específicamente para la normativa laboral chilena vigente 2026.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div key={f.title} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#2563EB]/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Asistente IA de derecho laboral</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
            Consulta sobre artículos del Código del Trabajo, calcula indemnizaciones, resuelve dudas sobre contratos y más. Respuestas con citas legales precisas.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Shield, text: 'Cita artículos exactos del Código del Trabajo' },
              { icon: Users, text: 'Conoce los datos de tu empresa y trabajadores' },
              { icon: CheckCircle, text: 'Actualizado con normativa 2026' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 text-left backdrop-blur-sm">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" />
                <p className="text-sm text-blue-50">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Simplifica la gestión laboral de tu empresa</h2>
          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Solicita una demo personalizada y descubre cómo PymeLaboral puede ayudarte a cumplir con la normativa laboral chilena.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto rounded-xl bg-[#2563EB] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#1E40AF] transition-colors">
                Ir al Dashboard
              </Link>
            ) : (
              <button
                onClick={() => setDemoOpen(true)}
                className="w-full sm:w-auto rounded-xl bg-[#2563EB] px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-[#1E40AF] transition-colors"
              >
                Solicita una demo gratuita
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2563EB] text-xs font-bold text-white">PL</div>
            <span className="text-sm font-semibold text-gray-700">PymeLaboral</span>
          </div>
          <p className="text-sm text-gray-400">&copy; 2026 PymeLaboral. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {demoSent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#059669]/10">
                  <CheckCircle className="h-8 w-8 text-[#059669]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">¡Listo!</h3>
                <p className="mt-2 text-sm text-gray-500">Te enviaremos una demo personalizada en las próximas horas.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Solicita tu demo gratuita</h3>
                  <button onClick={() => setDemoOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      value={demoForm.name}
                      onChange={e => setDemoForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tu nombre completo"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3.5 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      value={demoForm.phone}
                      onChange={e => setDemoForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+56 9 1234 5678"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3.5 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="flex h-11 w-full items-center justify-center rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-sm hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
                  >
                    {demoLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar solicitud'}
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-gray-400">Te contactaremos en menos de 24 horas hábiles</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sales Chat Widget — only on landing */}
      {!user && <SalesChatWidget />}
    </div>
  );
}
