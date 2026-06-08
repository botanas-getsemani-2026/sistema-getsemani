import { CheckCircle, XCircle } from 'lucide-react';

export function StatusActions({ status, onAutorizar, onRechazar }) {
  const esPendiente = status === 'pendiente';

  return (
    <div className="flex gap-3">
      <button
        onClick={onAutorizar}
        disabled={!esPendiente}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
          ${esPendiente
            ? 'bg-green-600 text-green-100 hover:bg-green-700'
            : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
          }
        `}
      >
        <CheckCircle size={18} />
        Autorizar
      </button>
      <button
        onClick={onRechazar}
        disabled={!esPendiente}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
          ${esPendiente
            ? 'bg-red-600 text-red-100 hover:bg-red-700'
            : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
          }
        `}
      >
        <XCircle size={18} />
        Rechazar
      </button>
    </div>
  );
}