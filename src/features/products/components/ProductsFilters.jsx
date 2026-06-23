import { Search, Plus } from 'lucide-react';
import { PRODUCTS_STATUS, PRODUCT_TYPE_OPTIONS } from '../../../constants/products';

export function ProductsFilters({
  searchTerm,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onNewProduct,
}) {
  return (
    <div className="flex gap-4 p-4 bg-surface-variant rounded-lg items-end">
      <div className="flex-1">
        <label className="block text-sm text-on-surface-variant mb-1">
          Buscar por nombre o código
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nombre o código del producto"
            className="w-full px-3 py-2 pl-10 bg-on-background border border-outline rounded-md text-on-primary"
          />
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm text-on-surface-variant mb-1">
          Tipo
        </label>
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary"
        >
          {PRODUCT_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm text-on-surface-variant mb-1">
          Estado
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full px-3 py-2 bg-on-background border border-outline rounded-md text-on-primary"
        >
          <option value="todos">Todos</option>
          <option value={PRODUCTS_STATUS.ACTIVE}>Activo</option>
          <option value={PRODUCTS_STATUS.INACTIVE}>Inactivo</option>
          <option value={PRODUCTS_STATUS.DISCONTINUED}>Descontinuado</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={onNewProduct}
          className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>
    </div>
  );
}
