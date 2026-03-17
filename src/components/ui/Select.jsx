import { forwardRef } from 'react';

export const Select = forwardRef(({ label, error, options = [], placeholder, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        className={`h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:bg-gray-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';
