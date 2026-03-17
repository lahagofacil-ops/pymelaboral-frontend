import { forwardRef, useState } from 'react';

export const CLPInput = forwardRef(({ label, error, value, onChange, ...props }, ref) => {
  const [display, setDisplay] = useState(() => {
    if (value) return Number(value).toLocaleString('es-CL');
    return '';
  });

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    setDisplay(num ? num.toLocaleString('es-CL') : '');
    if (onChange) onChange({ target: { value: num.toString(), name: e.target.name } });
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
        <input
          ref={ref}
          type="text"
          value={display}
          onChange={handleChange}
          className={`h-9 w-full rounded-lg border border-gray-300 bg-white pl-7 pr-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
CLPInput.displayName = 'CLPInput';
