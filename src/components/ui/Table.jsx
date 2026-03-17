export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return <thead className="border-b border-gray-200 bg-gray-50/50">{children}</thead>;
}

export function Th({ children, className = '' }) {
  return <th className={`px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function Tr({ children, className = '', onClick }) {
  return <tr className={`transition-colors hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>{children}</tr>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
}
