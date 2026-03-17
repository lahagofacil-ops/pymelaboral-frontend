import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const variants = {
  info: { bg: 'bg-blue-50 border-blue-200', icon: Info, iconColor: 'text-blue-600', text: 'text-blue-800' },
  success: { bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600', text: 'text-green-800' },
  warning: { bg: 'bg-yellow-50 border-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-600', text: 'text-yellow-800' },
  error: { bg: 'bg-red-50 border-red-200', icon: XCircle, iconColor: 'text-red-600', text: 'text-red-800' },
};

export function Alert({ variant = 'info', title, children, className = '' }) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${v.bg} ${className}`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${v.iconColor}`} />
      <div>
        {title && <p className={`text-sm font-medium ${v.text}`}>{title}</p>}
        <div className={`text-sm ${v.text} opacity-90`}>{children}</div>
      </div>
    </div>
  );
}
