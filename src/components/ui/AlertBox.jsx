import { AlertTriangle, Info } from 'lucide-react';

export function AlertBox({ message, type = 'warning' }) {
  if (!message) return null;

  const isWarning = type === 'warning';

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border ${
      isWarning
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {isWarning
        ? <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-amber-500" />
        : <Info size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
      }
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
