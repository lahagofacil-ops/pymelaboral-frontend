import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { post } from '../api/client'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy tu asistente laboral con IA. ¿En qué puedo ayudarte?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await post('/api/chat', { message: text })
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.data.reply || 'Sin respuesta' },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Error al obtener respuesta. Intenta nuevamente.' },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.message || 'Error de conexión. Intenta nuevamente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          title="Chat IA"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2563EB] text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium text-sm">Asistente Laboral IA</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 text-[#111827]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#6B7280]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E5E7EB] p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta..."
                className="flex-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
