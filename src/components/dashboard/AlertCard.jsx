import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const levels = {
  urgente: { bg: 'bg-red-50 border-red-200', icon: AlertTriangle, iconColor: 'text-red-600', text: 'text-red-800' },
  importante: { bg: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-600', text: 'text-yellow-800' },
  info: { bg: 'bg-blue-50 border-blue-200', icon: Info, iconColor: 'text-blue-600', text: 'text-blue-800' },
};

export function AlertCard({ title, description, level = 'info', href }) {
  const l = levels[level] || levels.info;
  const Icon = l.icon;
  const content = (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${l.bg}`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${l.iconColor}`} />
      <div>
        <p className={`text-sm font-medium ${l.text}`}>{title}</p>
        {description && <p className={`text-xs ${l.text} opacity-75`}>{description}</p>}
      </div>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}
