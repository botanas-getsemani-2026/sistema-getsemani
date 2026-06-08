import { X, AlertTriangle } from 'lucide-react';

export function RejectModal({ isOpen, onClose, onReject, motivo, onMotivoChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const motivoValue = motivo || onMotivoChange ? motivo : '';
    if (motivoValue.trim()) {
      onReject();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e) => {
    if (onMotivoChange) {
      onMotivoChange(e.target.value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-on-background flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            Rechazar Carga
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-on-surface-variant mb-1">
              Motivo del rechazo
            </label>
            <textarea
              value={motivo}
              onChange={handleChange}
              placeholder="Ingresa el motivo del rechazo..."
              rows={4}
              required
              className="w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background resize-none"
            />
            <p className="mt-2 text-xs text-on-surface-variant">
              Al rechazar, se guardará el log del cambio de status.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!motivo?.trim()}
              className="flex-1 px-4 py-2 bg-red-600 text-red-100 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rechazar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}