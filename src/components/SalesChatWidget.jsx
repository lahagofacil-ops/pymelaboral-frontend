import { useState } from 'react'
import { MessageCircle, X, Send, Check } from 'lucide-react'

export default function SalesChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
      if (!webhookUrl) throw new Error('Webhook no configurado')
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'consulta', ...form }),
      })
      if (!response.ok) throw new Error('Error al enviar')
      setSent(true)
    } catch (err) {
      setError(err.message || 'Error al enviar mensaje')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ nombre: '', email: '', mensaje: '' })
    setSent(false)
    setError('')
  }

  return (
    <>
      {/* Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#059669] hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          title="Escríbenos"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-80 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#059669] text-white">
            <span className="font-medium text-sm">¿Tienes dudas? Escríbenos</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {sent ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-[#059669]" />
                </div>
                <p className="text-sm font-medium text-[#111827] mb-1">Mensaje enviado</p>
                <p className="text-xs text-[#6B7280] mb-3">Te contactaremos pronto.</p>
                <button
                  onClick={handleReset}
                  className="text-sm text-[#2563EB] hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    required
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Tu email"
                    required
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    placeholder="Tu mensaje..."
                    required
                    rows={3}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent resize-none"
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#DC2626]">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
