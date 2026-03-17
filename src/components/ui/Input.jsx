export default function Input({
  label,
  name,
  type = 'text',
  error,
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-[#6B7280]" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`
            block w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#111827]
            placeholder:text-[#6B7280]
            focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
            disabled:bg-gray-50 disabled:text-[#6B7280] disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#E5E7EB]'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#DC2626]">{error}</p>
      )}
    </div>
  )
}
