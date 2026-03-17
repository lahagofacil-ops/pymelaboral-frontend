export default function Select({
  label,
  name,
  options = [],
  error,
  placeholder = 'Seleccionar...',
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-[#111827] mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`
          block w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#111827]
          focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
          disabled:bg-gray-50 disabled:text-[#6B7280] disabled:cursor-not-allowed
          ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#E5E7EB]'}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#DC2626]">{error}</p>
      )}
    </div>
  )
}
