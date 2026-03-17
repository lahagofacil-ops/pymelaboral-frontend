import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign, FileText, Clock, Shield, Building2, Bot,
  Check, ArrowRight, X, Send, Loader2
} from 'lucide-react'
import { PLANS } from '../../lib/constants'
import { formatCLP } from '../../lib/utils'
import SalesChatWidget from '../../components/SalesChatWidget'

const FEATURES = [
  {
    icon: DollarSign,
    title: 'Remuneraciones',
    description: 'Calcula liquidaciones de sueldo con todos los descuentos legales chilenos de forma automatica.',
  },
  {
    icon: FileText,
    title: 'Contratos',
    description: 'Genera contratos laborales digitales adaptados a la legislacion chilena vigente.',
  },
  {
    icon: Clock,
    title: 'Asistencia',
    description: 'Controla la asistencia, horas extra y permisos de tus trabajadores en un solo lugar.',
  },
  {
    icon: Shield,
    title: 'Ley Karin',
    description: 'Cumple con la Ley 21.643 de acoso laboral. Protocolo, denuncias y seguimiento integrado.',
  },
  {
    icon: Building2,
    title: 'Cotizaciones Previsionales',
    description: 'Genera y gestiona las cotizaciones de AFP, salud y seguro de cesantia de tus trabajadores.',
  },
  {
    icon: Bot,
    title: 'IA Integrada',
    description: 'Consulta dudas laborales, genera documentos y obtiene respuestas al instante con inteligencia artificial.',
  },
]

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoForm, setDemoForm] = useState({
    nombre: '', email: '', empresa: '', telefono: '', mensaje: '',
  })
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoSent, setDemoSent] = useState(false)
  const [demoError, setDemoError] = useState('')

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    setDemoLoading(true)
    setDemoError('')
    try {
      const res = await fetch('https://n8n.pymelaboral.cl/webhook/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setDemoSent(true)
    } catch {
      setDemoError('No se pudo enviar la solicitud. Intenta nuevamente.')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#2563EB]" />
            <span className="text-xl font-bold text-[#111827]">PymeLaboral</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDemoOpen(true)}
              className="text-sm font-medium text-[#2563EB] hover:text-[#1E40AF] transition-colors"
            >
              Solicita una demo
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E40AF] transition-colors"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight">
            Gestion laboral simple
            <br />
            para PYMEs chilenas
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto">
            Remuneraciones, contratos, asistencia, Ley Karin y cotizaciones previsionales.
            Todo en una sola plataforma con inteligencia artificial.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-[#1E40AF] transition-colors"
            >
              Solicita una demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-[#E5E7EB] text-[#111827] px-8 py-3.5 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827]">
              Todo lo que necesitas para gestionar tu equipo
            </h2>
            <p className="mt-4 text-[#6B7280] text-lg max-w-2xl mx-auto">
              Cumple con la normativa laboral chilena sin complicaciones. Automatiza procesos y enfocate en hacer crecer tu negocio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827]">
              Planes para cada etapa de tu empresa
            </h2>
            <p className="mt-4 text-[#6B7280] text-lg">
              Sin contratos de permanencia. Cancela cuando quieras.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => {
              const isPopular = plan.id === 'profesional'
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white border rounded-xl p-6 flex flex-col ${
                    isPopular ? 'border-[#2563EB] ring-2 ring-[#2563EB]' : 'border-[#E5E7EB]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Mas popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#111827]">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    {plan.price != null ? (
                      <>
                        <span className="text-3xl font-bold text-[#111827]">{formatCLP(plan.price)}</span>
                        <span className="text-[#6B7280] text-sm">/mes</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-[#111827]">Contactar</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#6B7280]">
                        <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isPopular
                        ? 'bg-[#2563EB] text-white hover:bg-[#1E40AF]'
                        : 'border border-[#E5E7EB] text-[#111827] hover:bg-gray-50'
                    }`}
                  >
                    {plan.price != null ? 'Solicitar demo' : 'Contactar ventas'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#111827]">
            Simplifica la gestion laboral de tu PYME hoy
          </h2>
          <p className="mt-4 text-[#6B7280] text-lg">
            Unete a las empresas chilenas que ya automatizan sus procesos de recursos humanos.
          </p>
          <button
            onClick={() => setDemoOpen(true)}
            className="mt-8 inline-flex items-center gap-2 bg-[#2563EB] text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-[#1E40AF] transition-colors"
          >
            Solicita una demo gratuita
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#2563EB]" />
              <span className="text-lg font-bold text-[#111827]">PymeLaboral</span>
            </div>
            <p className="text-sm text-[#6B7280]">
              &copy; {new Date().getFullYear()} PymeLaboral. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDemoOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827]">Solicita una demo</h2>
              <button
                onClick={() => setDemoOpen(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              {demoSent ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-[#059669]" />
                  </div>
                  <p className="text-base font-medium text-[#111827] mb-2">Solicitud enviada</p>
                  <p className="text-sm text-[#6B7280]">
                    Nos pondremos en contacto contigo pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={demoForm.nombre}
                      onChange={(e) => setDemoForm({ ...demoForm, nombre: e.target.value })}
                      className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1">Empresa</label>
                    <input
                      type="text"
                      required
                      value={demoForm.empresa}
                      onChange={(e) => setDemoForm({ ...demoForm, empresa: e.target.value })}
                      className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1">Telefono</label>
                    <input
                      type="tel"
                      value={demoForm.telefono}
                      onChange={(e) => setDemoForm({ ...demoForm, telefono: e.target.value })}
                      className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1">Mensaje</label>
                    <textarea
                      rows={3}
                      value={demoForm.mensaje}
                      onChange={(e) => setDemoForm({ ...demoForm, mensaje: e.target.value })}
                      className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                    />
                  </div>
                  {demoError && (
                    <p className="text-sm text-[#DC2626]">{demoError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
                  >
                    {demoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Enviar solicitud
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales Chat Widget */}
      <SalesChatWidget />
    </div>
  )
}
