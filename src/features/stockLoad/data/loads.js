import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "../../../core/providers/hooks/useSupabase";

export const useLoadsQueries = (vendorId, loadDate) => {
  const client = useSupabaseClient();

  const getVendorWithLoads = async (vendorId, loadDate) => {
    const getDateRange = (date) => {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59.999`);
      return { start: start.toISOString(), end: end.toISOString() };
    }

    const { start, end } = getDateRange(loadDate);

    const { data: vendorResult, error: vendorError } = await client
      .from("perfiles")
      .select("*")
      .eq("id", vendorId)
      .single();

    if (vendorError || !vendorResult) return null;

    const { data: loadsResult, error: loadsError } = await client
      .from("cargas")
      .select("*, cargas_detalles(*, productos(*))")
      .eq("id_usuario", vendorId)
      .gte("fecha", start)
      .lte("fecha", end)

    console.log(loadsResult);

    if (loadsError || !loadsResult) return null;

    const result = {
      vendor: vendorResult,
      loads: loadsResult.map((load) => ({
        id: load.id,
        loadDate: load.fecha,
        status: load.status,
        rejectionReason: load.motivo_rechazo,
        details: (load.cargas_detalles || []).map((detail) => ({
          id: detail.id,
          loadId: detail.id_carga,
          productId: detail.id_producto,
          quantity: detail.cantidad,
          product: detail.productos,
          totalPrice:
            detail.cantidad * (detail.productos?.precio || 0),
        })),
      })),
    };

    console.log(result);
    return result;
  };

  const { data: vendorData = null, isLoading, refetch } = useQuery({
    queryKey: ['vendorLoads', vendorId, loadDate],
    queryFn: () => getVendorWithLoads(vendorId, loadDate),
    enabled: false, // Solo ejecutar si vendorId y loadDate están disponibles
    // staleTime: 0,
  });

  return { vendorData, loading: isLoading, refetch };
};
