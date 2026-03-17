import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin datos',
  description = '',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="w-12 h-12 text-[#E5E7EB] mb-4" />
      <h3 className="text-base font-medium text-[#111827] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] mb-4 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
