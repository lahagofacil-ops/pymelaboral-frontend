import { Loader2 } from 'lucide-react';

export function Loader({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-[#1F4E79]" />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#1F4E79]" />
    </div>
  );
}
