import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign, FileText, AlertTriangle, Calculator, ShieldCheck,
  MessageSquare, Check, X, ArrowRight, Star, Zap, Building2, Users
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import SalesChatWidget from '../../components/SalesChatWidget'

const features = [
  {
    icon: DollarSign,
    title: 'Liquidaciones',
    description: 'Calcula liquidaciones de sueldo automáticamente según la normativa chilena vigente.',
  },
  {
    icon: FileText,
    title: 'Contratos',
    description: 'Gestiona contratos de trabajo, anexos y términos de relación laboral.',
  },
  {
    icon: AlertTriangle,
    title: 'Ley Karin',
    description: 'Canal de denuncias y gestión de acoso laboral según Ley 21.643.',
  },
  {
    icon: Calculator,
    title: 'Cotizaciones',
    description: 'Genera y controla las cotizaciones previsionales de AFP, salud y cesantía.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Verifica el cumplimiento de obligaciones laborales en tiempo real.',
  },
  {
    icon: MessageSquare,
    title: 'Chat IA',
    description: 'Consulta dudas laborales al asistente inteligente disponible 24/7.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$20.000',
    period: '/mes',
    workers: 'Hasta 5 trabajadores',
    features: ['Liquidaciones', 'Contratos', 'Cotizaciones', 'Compliance básico', 'Chat IA'],
    popular: false,
  },
  {
    name: 'Profesional',
    price: '$50.000',
    period: '/mes',
    workers: 'Hasta 25 trabajadores',
    features: ['Todo en Starter', 'Ley Karin', 'Vacaciones y permisos', 'Asistencia', 'Finiquitos', 'Documentos'],
    popular: true,
  },
  {
    name: 'Business',
    price: '$90.000',
    period: '/mes',
    workers: 'Hasta 100 trabajadores',
    features: ['Todo en Profesional', 'Multi-usuario', 'Compliance avanzado', 'Soporte prioritario', 'RIOHS automático'],
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Contactar',
    period: '',
    workers: 'Trabajadores ilimitados',
    features: ['Todo en Business', 'Supervisora dedicada', 'Integraciones custom', 'SLA garantizado', 'Onboarding personalizado'],
    popular: false,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [showDemo, setShowDemo] = useState(false)
  const [demoForm, setDemoForm] = useState({ nombre: '', email: '', telefono: '', empresa: '' })
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoSent, setDemoSent] = useState(false)
  const [demoError, setDemoError] = useState('')

  const handleDemoChange = (e) => {
    setDemoForm({ ...demoForm, [e.target.name]: e.target.value })
  }

  const handleDemoSubmit = async (e) => {
    e.preventDefault()
    setDemoLoading(true)
    setDemoError('')
    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
      if (!webhookUrl) throw new Error('Webhook no configurado')
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'demo', ...demoForm }),
      })
      if (!response.ok) throw new Error('Error al enviar solicitud')
      setDemoSent(true)
    } catch (err) {
      setDemoError(err.message || 'Error al enviar solicitud')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#2563EB]">PymeLaboral</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDemo(true)}
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Solicita Demo
            </button>
            <Button onClick={() => navigate('/login')} size="sm">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mb-6 leading-tight">
            Gestión laboral simple para PyMEs chilenas
          </h2>
          <p className="text-lg text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Liquidaciones, contratos, cotizaciones, compliance y más. Todo en una plataforma diseñada
            para cumplir con la normativa laboral chilena sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => setShowDemo(true)}>
              Solicita Demo
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#111827] mb-4">Todo lo que necesitas</h3>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Una plataforma completa para gestionar las relaciones laborales de tu empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2">{feature.title}</h4>
                <p className="text-sm text-[#6B7280]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#111827] mb-4">Planes y Precios</h3>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Elige el plan que mejor se adapte al tamaño de tu empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border ${
                  plan.popular
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB] relative'
                    : 'border-[#E5E7EB]'
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-[#2563EB] text-white text-xs font-medium px-3 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      Más popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#111827] mb-1">{plan.name}</h4>
                  <p className="text-sm text-[#6B7280] mb-4">{plan.workers}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#111827]">{plan.price}</span>
                    <span className="text-sm text-[#6B7280]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => setShowDemo(true)}
                >
                  {plan.price === 'Contactar' ? 'Contactar' : 'Solicita Demo'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#6B7280]">
            &copy; {new Date().getFullYear()} PymeLaboral. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDemo(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#111827]">Solicita una Demo</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {demoSent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-[#059669]" />
                </div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2">Solicitud enviada</h4>
                <p className="text-sm text-[#6B7280] mb-4">
                  Te contactaremos pronto para coordinar tu demo.
                </p>
                <Button variant="secondary" onClick={() => setShowDemo(false)}>
                  Cerrar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <Input
                  label="Nombre"
                  name="nombre"
                  value={demoForm.nombre}
                  onChange={handleDemoChange}
                  required
                  placeholder="Tu nombre completo"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={demoForm.email}
                  onChange={handleDemoChange}
                  required
                  placeholder="tu@email.com"
                />
                <Input
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={demoForm.telefono}
                  onChange={handleDemoChange}
                  required
                  placeholder="+56 9 1234 5678"
                />
                <Input
                  label="Empresa"
                  name="empresa"
                  value={demoForm.empresa}
                  onChange={handleDemoChange}
                  required
                  placeholder="Nombre de tu empresa"
                />
                {demoError && (
                  <p className="text-sm text-[#DC2626]">{demoError}</p>
                )}
                <Button type="submit" loading={demoLoading} className="w-full">
                  Enviar Solicitud
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <SalesChatWidget />
    </div>
  )
}
