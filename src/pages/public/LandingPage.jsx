import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Calculator, Clock, CalendarDays, ShieldAlert, CheckCircle2,
  X, ArrowRight, Check
} from 'lucide-react'
import SalesChatWidget from '../../components/SalesChatWidget'

const features = [
  { icon: FileText, title: 'Liquidaciones', desc: 'Genera liquidaciones de sueldo automáticas y conformes a la ley.' },
  { icon: Calculator, title: 'Cotizaciones', desc: 'Calcula y gestiona cotizaciones previsionales AFP, salud e ISL.' },
  { icon: Clock, title: 'Asistencia', desc: 'Control de asistencia con marcaje digital y reportes.' },
  { icon: CalendarDays, title: 'Vacaciones', desc: 'Gestión de vacaciones con cálculo automático de días disponibles.' },
  { icon: ShieldAlert, title: 'Ley Karin', desc: 'Protocolo de prevención y canal de denuncias Ley 21.643.' },
  { icon: CheckCircle2, title: 'Compliance', desc: 'Cumplimiento normativo laboral actualizado automáticamente.' }
]

const plans = [
  { name: 'Starter', price: '$20.000', workers: 'Hasta 5 trabajadores', features: ['Liquidaciones', 'Cotizaciones', 'Asistencia', 'Soporte email'] },
  { name: 'Profesional', price: '$50.000', workers: 'Hasta 25 trabajadores', popular: true, features: ['Todo en Starter', 'Vacaciones', 'Permisos', 'Ley Karin', 'Soporte prioritario'] },
  { name: 'Business', price: '$90.000', workers: 'Hasta 100 trabajadores', features: ['Todo en Profesional', 'Compliance', 'Finiquitos', 'Documentos', 'Asistente IA'] },
  { name: 'Enterprise', price: 'Contactar', workers: 'Trabajadores ilimitados', features: ['Todo en Business', 'API dedicada', 'Soporte 24/7', 'Implementación guiada'] }
]

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)
  const [demoForm, setDemoForm] = useState({ nombre: '', email: '', empresa: '', telefono: '', mensaje: '' })
  const [demoSent, setDemoSent] = useState(false)
  const [demoSending, setDemoSending] = useState(false)

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    setDemoSending(true)
    try {
      // Webhook placeholder - just log for now
      console.log('Demo request:', demoForm)
      setDemoSent(true)
    } catch {
      alert('Error al enviar solicitud')
    } finally {
      setDemoSending(false)
    }
  }

  const onDemoChange = (field) => (e) => setDemoForm({ ...demoForm, [field]: e.target.value })

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#2563EB]">PymeLaboral</span>
          <Link to="/login" className="text-sm text-[#2563EB] hover:text-[#1E40AF] font-medium">
            Iniciar sesión
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4 leading-tight">
            Gestión laboral simple para PYMEs chilenas
          </h1>
          <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Liquidaciones, cotizaciones, asistencia, vacaciones y cumplimiento normativo en una sola plataforma.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1E40AF] transition-colors font-medium flex items-center gap-2 cursor-pointer"
            >
              Solicita una demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/login" className="text-[#2563EB] hover:text-[#1E40AF] font-medium px-6 py-3">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-10">
            Todo lo que necesitas para gestionar tu equipo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-10">Planes y Precios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`bg-white rounded-lg border p-6 flex flex-col ${p.popular ? 'border-[#2563EB] ring-2 ring-[#2563EB]' : 'border-[#E5E7EB]'}`}>
                {p.popular && (
                  <span className="text-xs font-medium text-[#2563EB] bg-blue-50 px-2 py-1 rounded-full self-start mb-3">
                    Más popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-[#111827] mb-1">{p.name}</h3>
                <p className="text-2xl font-bold text-[#2563EB] mb-1">
                  {p.price}<span className="text-sm font-normal text-[#6B7280]">{p.price !== 'Contactar' ? '/mes' : ''}</span>
                </p>
                <p className="text-sm text-[#6B7280] mb-4">{p.workers}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-[#111827]">
                      <Check className="w-4 h-4 text-[#059669] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowDemo(true)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    p.popular
                      ? 'bg-[#2563EB] text-white hover:bg-[#1E40AF]'
                      : 'border border-[#E5E7EB] text-[#111827] hover:bg-gray-50'
                  }`}
                >
                  {p.price === 'Contactar' ? 'Contactar' : 'Solicitar demo'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-[#6B7280]">&copy; {new Date().getFullYear()} PymeLaboral. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827]">Solicitar Demo</h2>
              <button onClick={() => { setShowDemo(false); setDemoSent(false) }}
                className="text-[#6B7280] hover:text-[#111827] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {demoSent ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#111827] mb-2">Solicitud enviada</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Nos pondremos en contacto contigo a la brevedad.
                </p>
                <button
                  onClick={() => { setShowDemo(false); setDemoSent(false); setDemoForm({ nombre: '', email: '', empresa: '', telefono: '', mensaje: '' }) }}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
                  <input type="text" value={demoForm.nombre} onChange={onDemoChange('nombre')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
                  <input type="email" value={demoForm.email} onChange={onDemoChange('email')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Empresa</label>
                  <input type="text" value={demoForm.empresa} onChange={onDemoChange('empresa')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Teléfono</label>
                  <input type="tel" value={demoForm.telefono} onChange={onDemoChange('telefono')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Mensaje</label>
                  <textarea value={demoForm.mensaje} onChange={onDemoChange('mensaje')} rows={3}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowDemo(false)}
                    className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                    Cancelar
                  </button>
                  <button type="submit" disabled={demoSending}
                    className="px-4 py-2 text-sm text-white bg-[#2563EB] rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer">
                    {demoSending ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <SalesChatWidget />
    </div>
  )
}
