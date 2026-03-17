import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

const typeConfig = {
  success: {
    bg: 'bg-green-50 border-[#059669]',
    text: 'text-[#059669]',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50 border-[#DC2626]',
    text: 'text-[#DC2626]',
    icon: AlertCircle,
  },
  warning: {
    bg: 'bg-yellow-50 border-[#D97706]',
    text: 'text-[#D97706]',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-50 border-[#2563EB]',
    text: 'text-[#2563EB]',
    icon: Info,
  },
}

export default function Alert({ type = 'info', message, onClose, className = '' }) {
  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border',
        config.bg,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.text)} />
      <p className={cn('text-sm flex-1', config.text)}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('p-0.5 rounded hover:bg-black/5 shrink-0', config.text)}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
