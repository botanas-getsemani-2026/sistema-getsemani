import { useState, useMemo } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';

export function AddProductModal({ isOpen, onClose, onAdd, products = [], currentDetails = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [cantidad, setCantidad] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const isBulk = productoSeleccionado?.es_a_granel;

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];

    const searchLower = searchTerm.toLowerCase();
    const idsActuales = currentDetails.map(d => d.productId);

    return products.filter(p => {
      const matchName = p.nombre.toLowerCase().includes(searchLower);
      const matchType = typeFilter === 'todos'
        || (typeFilter === 'granel' && p.es_a_granel)
        || (typeFilter === 'pieza' && !p.es_a_granel);
      const canAddToLoad = !idsActuales.includes(p.id);

      return matchName && matchType && canAddToLoad;
    });
  }, [products, searchTerm, typeFilter, currentDetails]);

  const productoNoExiste = useMemo(() => {
    if (searchTerm.length < 3) return false;
    const found = products.find(
      p => p.nombre.toLowerCase() === searchTerm.toLowerCase()
    );
    return !found;
  }, [products, searchTerm]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setProductoSeleccionado(null);
  };

  const handleSelectProduct = (product) => {
    setProductoSeleccionado(product);
    setSearchTerm(product.nombre);
  };

  const handleAdd = () => {
    if (productoSeleccionado && cantidad > 0) {
      onAdd(productoSeleccionado.id, cantidad);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setTypeFilter('todos');
    setCantidad(0);
    setProductoSeleccionado(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-surface border border-outline rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-on-background">
            Añadir producto a la carga
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-on-surface-variant mb-1">
              Buscar producto
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2 pl-10 bg-background border border-outline rounded-md text-on-background"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-background border border-outline rounded-md text-on-background"
              >
                <option value="todos">Todos</option>
                <option value="granel">Granel</option>
                <option value="pieza">Por unidad</option>
              </select>
            </div>
            {productoNoExiste && (
              <p className="mt-2 text-sm text-error">
                El producto no existe
              </p>
            )}
          </div>

          {filteredProducts.length > 0 && !productoSeleccionado && (
            <ul className="max-h-40 overflow-y-auto bg-background border border-outline rounded-md">
              {filteredProducts.map(p => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="w-full px-3 py-2 text-left hover:bg-surface-variant transition-colors flex justify-between items-center"
                  >
                    <span className="text-on-background">{p.nombre}</span>
                    <span className="text-xs text-on-surface-variant">
                      {p.es_a_granel ? 'Granel' : 'Por unidad'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {productoSeleccionado && (
            <div className="p-3 bg-surface-variant rounded-md">
              <p className="text-sm text-on-surface-variant mb-1">Producto seleccionado:</p>
              <p className="font-medium text-on-background">{productoSeleccionado.nombre}</p>
              <p className="text-sm text-on-surface-variant">
                {productoSeleccionado.codigo} - {formatCurrency(productoSeleccionado.precio)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {productoSeleccionado.es_a_granel ? 'Granel' : 'Por unidad'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm text-on-surface-variant mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min={isBulk ? '0.5' : '1'}
              step={isBulk ? '0.5' : '1'}
              value={cantidad}
              onChange={(e) => setCantidad(
                isBulk 
                ? parseFloat(e.target.value) || 0 
                : parseInt(e.target.value) || 0
              )}
              placeholder="Cantidad a cargar"
              className="w-full px-3 py-2 bg-background border border-outline rounded-md text-on-background"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-outline rounded-md hover:bg-surface-variant transition-colors text-on-background"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!productoSeleccionado || cantidad < 0.5 || productoNoExiste}
            className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}