import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useEmpresa } from '../../context/EmpresaContext'
import Spinner from '../../components/ui/Spinner'

export default function ChatPage() {
  const { empresaId } = useEmpresa()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await apiClient.post('/api/chat', { message: text, empresaId })
      if (res.success) {
        const botMsg = {
          role: 'assistant',
          content: res.data?.response || res.data?.message || res.data || 'Sin respuesta',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${res.error || 'No se pudo obtener respuesta'}`, timestamp: new Date().toISOString() },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error de conexion. Intenta nuevamente.', timestamp: new Date().toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#111827]">Asistente IA</h1>
        <p className="text-[#6B7280] text-sm">Consulta dudas laborales, genera documentos y mas</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 border border-[#E5E7EB] rounded-xl p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-[#6B7280]">Haz una pregunta sobre gestion laboral</p>
            <p className="text-sm text-[#6B7280] mt-1">Por ejemplo: "Como calculo las vacaciones proporcionales?"</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#2563EB]" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#111827]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#6B7280]" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta..."
          className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center w-10 h-10 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
