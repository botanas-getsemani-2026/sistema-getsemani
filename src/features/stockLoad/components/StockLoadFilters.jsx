import { Search } from 'lucide-react';

export function StockLoadFilters({
  vendors,
  selectedVendor,
  selectedDate,
  onVendorChange,
  onDateChange,
  onSearch,
}) {
  return (
    <div className="flex gap-4 p-4 bg-surface-variant rounded-lg">
      <div className="flex-1">
        <label className="block text-sm text-on-surface-variant mb-1">
          Vendedor
        </label>
        <select
          value={selectedVendor?.id || ''}
          onChange={(e) => {
            const id = e.target.value;
            const vendor = vendors.find(v => v.id === id);
            onVendorChange(vendor || null);
          }}
          className="w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary"
        >
          <option value="">Selecciona un vendedor.</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>
              {v.nombre} {v.apellido} ({v.email.split('@')[0]})
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm text-on-surface-variant mb-1">
          Fecha de carga
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary"
          />
        </div>
      </div>

      <div className="flex items-end">
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </div>
  );
}