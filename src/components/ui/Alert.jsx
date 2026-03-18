import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { classNames } from '../../lib/utils'

const config = {
  info: {
    border: 'border-l-[#2563EB]',
    bg: 'bg-blue-50',
    text: 'text-[#2563EB]',
    Icon: Info
  },
  success: {
    border: 'border-l-[#059669]',
    bg: 'bg-green-50',
    text: 'text-[#059669]',
    Icon: CheckCircle
  },
  error: {
    border: 'border-l-[#DC2626]',
    bg: 'bg-red-50',
    text: 'text-[#DC2626]',
    Icon: XCircle
  },
  warning: {
    border: 'border-l-[#D97706]',
    bg: 'bg-amber-50',
    text: 'text-[#D97706]',
    Icon: AlertTriangle
  }
}

export default function Alert({ type = 'info', message, onClose }) {
  const { border, bg, text, Icon } = config[type]

  if (!message) return null

  return (
    <div className={classNames('border-l-4 rounded-r-lg p-4 flex items-start gap-3', border, bg)}>
      <Icon className={classNames('h-5 w-5 flex-shrink-0 mt-0.5', text)} />
      <p className={classNames('text-sm flex-1', text)}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={classNames('flex-shrink-0', text)}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
