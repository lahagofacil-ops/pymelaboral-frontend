import { cn } from '../../lib/utils'

export default function Card({ children, title, className = '', noPadding = false }) {
  return (
    <div className={cn('bg-white border border-[#E5E7EB] rounded-xl shadow-sm', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  )
}
