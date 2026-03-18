import { classNames } from '../../lib/utils'

export default function Select({ label, options = [], error, className, ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#111827] mb-1">
          {label}
        </label>
      )}
      <select
        className={classNames(
          'w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-white',
          error ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
        )}
        {...rest}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[#DC2626] text-xs mt-1">{error}</p>
      )}
    </div>
  )
}
