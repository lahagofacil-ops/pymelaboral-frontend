export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-sm font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return <div className={`px-4 pb-4 pt-2 border-t border-gray-100 ${className}`}>{children}</div>;
}
