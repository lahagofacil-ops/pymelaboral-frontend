import { cn } from '../../lib/utils'

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
  id,
  ...props
}) {
  const selectId = id || props.name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[#111827] mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error && 'border-[#DC2626] focus:ring-[#DC2626]',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt
          const optLabel = typeof opt === 'object' ? opt.label : opt
          return (
            <option key={value} value={value}>
              {optLabel}
            </option>
          )
        })}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#DC2626]">{error}</p>
      )}
    </div>
  )
}
