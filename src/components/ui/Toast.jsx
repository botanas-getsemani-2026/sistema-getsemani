import { X } from 'lucide-react';
import { useEffect } from 'react';

const STATUS_COLORS = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
  info: 'bg-blue-600',
};

export function Toast({ id, message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        text-white min-w-75 max-w-100
        animate-slide-in
        ${STATUS_COLORS[type] || STATUS_COLORS.info}
      `}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}