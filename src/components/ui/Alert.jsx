import { useState } from 'react'
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const typeConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-[#2563EB]',
    iconColor: 'text-[#2563EB]',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-[#059669]',
    iconColor: 'text-[#059669]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-[#D97706]',
    iconColor: 'text-[#D97706]',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-[#DC2626]',
    iconColor: 'text-[#DC2626]',
  },
}

export default function Alert({ type = 'info', message, closable = false, className = '' }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <p className={`text-sm flex-1 ${config.text}`}>{message}</p>
      {closable && (
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 p-0.5 rounded ${config.text} hover:opacity-70`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
