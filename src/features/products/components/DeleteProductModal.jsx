import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useProductUsageCount } from '../data/mutations';

export function DeleteProductModal({ isOpen, product, onClose, onConfirm }) {
  const { data: usageCount = 0, isLoading: isLoadingUsage } = useProductUsageCount(
    isOpen ? product?.id : null
  );

  const productName = product?.nombre ?? '';
  const hasUsage = !isLoadingUsage && usageCount > 0;

  const content = hasUsage
    ? `Este producto aparece en ${usageCount} carga(s). Al eliminarlo, esos registros perderán la referencia viva al producto, pero conservarán los datos ya guardados (código, nombre, precio y cantidad). Esta acción no se puede deshacer.`
    : `¿Eliminar el producto "${productName}"? Esta acción no se puede deshacer.`;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Eliminar producto"
      content={content}
      onClose={onClose}
      onConfirm={() => onConfirm(product?.id)}
    />
  );
}
