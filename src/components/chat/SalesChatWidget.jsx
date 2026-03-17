import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const WEBHOOK_URL = import.meta.env.VITE_SALES_CHAT_WEBHOOK;

export function SalesChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', content: '¡Hola! Soy el asistente de PymeLaboral. ¿En qué puedo ayudarte?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', phone: '' });
  const [infoCollected, setInfoCollected] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'visitor', content: text }]);
    setLoading(true);

    try {
      if (WEBHOOK_URL) {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat_message',
            message: text,
            visitorName: visitorInfo.name,
            visitorPhone: visitorInfo.phone,
            timestamp: new Date().toISOString(),
          }),
        });
        const data = await res.json();
        const reply = data.response || data.message || data.reply || 'Gracias por tu mensaje. Te contactaremos pronto.';
        setMessages(prev => [...prev, { role: 'agent', content: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', content: 'Déjanos tu consulta y te contactaremos pronto. También puedes escribirnos a contacto@pymelaboral.cl' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'agent', content: 'Déjanos tu consulta y te contactaremos pronto. También puedes escribirnos a contacto@pymelaboral.cl' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setInfoCollected(true);
    setMessages(prev => [...prev, { role: 'agent', content: `¡Gracias ${visitorInfo.name}! ¿Cuál es tu consulta?` }]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-white shadow-lg hover:bg-[#1E40AF] transition-all hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">¿Tienes dudas?</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-[480px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#2563EB] to-[#1E40AF] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">Chat PymeLaboral</p>
          <p className="text-xs opacity-75">Estamos para ayudarte</p>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/20 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'visitor'
                ? 'bg-[#2563EB] text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Info collection or chat input */}
      <div className="border-t border-gray-200 p-3">
        {!infoCollected ? (
          <form onSubmit={handleInfoSubmit} className="space-y-2">
            <p className="text-xs text-gray-500 text-center">Para atenderte mejor, déjanos tus datos:</p>
            <input
              value={visitorInfo.name}
              onChange={e => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre"
              className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              required
            />
            <input
              type="tel"
              value={visitorInfo.phone}
              onChange={e => setVisitorInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+56 9 1234 5678"
              className="h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              required
            />
            <button
              type="submit"
              className="h-9 w-full rounded-lg bg-[#2563EB] text-sm font-medium text-white hover:bg-[#1E40AF] transition-colors"
            >
              Comenzar chat
            </button>
          </form>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Escribe tu consulta..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-[#2563EB] px-3 py-2 text-white disabled:opacity-50 hover:bg-[#1E40AF] transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
