import { useState, useCallback } from 'react';

export function useStockLoad() {
  const [cargaActual] = useState(null);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [logs] = useState([]);

  const buscarCarga = useCallback(() => {
    if (!vendedorSeleccionado || !fechaSeleccionada) {
      return { success: false, message: 'Selecciona vendedor y fecha' };
    }

    return { success: false, message: 'Mock eliminado - Conecta a Supabase' };
  }, [vendedorSeleccionado, fechaSeleccionada]);

  const ordenarProductos = useCallback((productos, order) => {
    return [...productos].sort((a, b) => {
      const aOrden = a.product?.orden;
      const bOrden = b.product?.orden;
      const aHas = aOrden != null;
      const bHas = bOrden != null;

      if (!aHas && !bHas) return 0;
      if (!aHas) return order === 'asc' ? 1 : -1;
      if (!bHas) return order === 'asc' ? -1 : 1;

      if (order === 'asc') {
        return aOrden - bOrden;
      }
      return bOrden - aOrden;
    });
  }, []);

  const getProductosOrdenados = useCallback(() => {
    if (!cargaActual) return [];
    return ordenarProductos(cargaActual.productosEnriquecidos, sortOrder);
  }, [cargaActual, sortOrder, ordenarProductos]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const updateDetalleCantidad = useCallback(() => {
    return { success: false, message: 'Mock eliminado - Conecta a Supabase' };
  }, []);

  const removeProducto = useCallback(() => {
    return { success: false, message: 'Mock eliminado - Conecta a Supabase' };
  }, []);

  const addProducto = useCallback(() => {
    return false;
  }, []);

  const autorizarCarga = useCallback(() => {
    return false;
  }, []);

  const rechazarCarga = useCallback(() => {
    return false;
  }, []);

  return {
    cargaActual,
    sortOrder,
    setVendedorSeleccionado,
    setFechaSeleccionada,
    vendedorSeleccionado,
    fechaSeleccionada,
    buscarCarga,
    getProductosOrdenados,
    toggleSortOrder,
    updateDetalleCantidad,
    removeProducto,
    addProducto,
    autorizarCarga,
    rechazarCarga,
    logs,
  };
}