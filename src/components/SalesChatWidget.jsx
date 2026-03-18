import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

const FAQ_RESPONSES = {
  precio: 'Tenemos 4 planes: Starter ($20.000/mes, hasta 5 trabajadores), Profesional ($50.000/mes, hasta 25), Business ($90.000/mes, hasta 100) y Enterprise (precio a medida). Todos incluyen liquidaciones y cotizaciones.',
  plan: 'Tenemos 4 planes: Starter ($20.000/mes, hasta 5 trabajadores), Profesional ($50.000/mes, hasta 25), Business ($90.000/mes, hasta 100) y Enterprise (precio a medida). Todos incluyen liquidaciones y cotizaciones.',
  demo: 'Puedes solicitar una demo haciendo clic en el botón "Solicita una demo" en la página principal. Te contactaremos para agendar una demostración personalizada.',
  liquidacion: 'Nuestro sistema genera liquidaciones de sueldo automáticas, calculando imposiciones, descuentos legales y haberes. Compatible con la normativa chilena vigente.',
  cotizacion: 'Calculamos automáticamente las cotizaciones previsionales: AFP, salud, seguro de cesantía e ISL. Todo se genera junto con la liquidación.',
  vacacion: 'Gestionamos vacaciones con cálculo automático de días disponibles, solicitudes online, aprobación digital y registro histórico.',
  karin: 'Cumplimos con la Ley 21.643 (Ley Karin). Incluimos protocolo de prevención, canal de denuncias anónimo y seguimiento de casos.',
  compliance: 'Nuestro módulo de compliance te mantiene al día con la normativa laboral chilena. Alertas automáticas sobre cambios regulatorios y checklist de cumplimiento.',
  asistencia: 'Control de asistencia con marcaje digital, reportes de horas trabajadas, horas extra y atrasos. Integrado con las liquidaciones.',
  soporte: 'Todos los planes incluyen soporte por email. Los planes Profesional y Business incluyen soporte prioritario. Enterprise tiene soporte 24/7.',
  default: 'Gracias por tu consulta. Para información más detallada, te recomiendo solicitar una demo con nuestro equipo. También puedo ayudarte con preguntas sobre precios, planes, liquidaciones, cotizaciones, vacaciones, Ley Karin o compliance.'
}

function getResponse(message) {
  const lower = message.toLowerCase()
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      return response
    }
  }
  if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hi')) {
    return 'Hola, bienvenido a PymeLaboral. ¿En qué puedo ayudarte? Puedo contarte sobre nuestros planes, precios, funcionalidades o agendar una demo.'
  }
  if (lower.includes('gracia') || lower.includes('thank')) {
    return 'De nada, estamos para ayudarte. Si tienes más preguntas, no dudes en escribirnos.'
  }
  return FAQ_RESPONSES.default
}

export default function SalesChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hola, soy el asistente de PymeLaboral. ¿En qué puedo ayudarte?' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { role: 'user', text }
    const botMsg = { role: 'bot', text: getResponse(text) }

    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg border border-[#E5E7EB] shadow-xl z-50 flex flex-col" style={{ height: '420px' }}>
          <div className="bg-[#2563EB] text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <span className="font-medium text-sm">Asistente de Ventas</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 text-[#111827]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#E5E7EB] p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-[#2563EB] text-white p-2 rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-lg hover:bg-[#1E40AF] transition-colors flex items-center justify-center z-50 cursor-pointer"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  )
}
