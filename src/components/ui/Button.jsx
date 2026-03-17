import { Loader2 } from 'lucide-react';

const variants = {
  default: 'bg-[#2563EB] text-white hover:bg-[#1E40AF] shadow-sm',
  secondary: 'bg-[#059669] text-white hover:bg-[#047857] shadow-sm',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  link: 'text-[#2563EB] underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-10 px-6 text-sm',
  icon: 'h-9 w-9',
};

export function Button({ variant = 'default', size = 'default', loading = false, disabled, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
