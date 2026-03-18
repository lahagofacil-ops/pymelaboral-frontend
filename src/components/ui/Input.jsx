import { classNames } from '../../lib/utils'

export default function Input({ label, error, className, ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#111827] mb-1">
          {label}
        </label>
      )}
      <input
        className={classNames(
          'w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]',
          error ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
        )}
        {...rest}
      />
      {error && (
        <p className="text-[#DC2626] text-xs mt-1">{error}</p>
      )}
    </div>
  )
}
