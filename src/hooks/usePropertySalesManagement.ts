import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Hook for sales management pages (fetches all sales, not just available ones)
export function usePropertySalesManagement(type?: 'land' | 'house') {
    return useQuery({
        queryKey: ["property-sales-management", type],
        queryFn: async () => {
            let query = supabase
                .from("property_sales")
                .select(`
          *,
          land_parcels (
            parcel_id,
            area_sqm,
            location,
            kebele
          ),
          seller:land_owners!seller_id (
            full_name
          )
        `);

            if (type) {
                query = query.eq("property_type", type);
            }

            const { data, error } = await query.order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });
}

export function useCreatePropertySaleManagement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newSale: any) => {
            const { data, error } = await supabase
                .from("property_sales")
                .insert([newSale])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property-sales-management"] });
            queryClient.invalidateQueries({ queryKey: ["sale-stats"] });
        },
    });
}

export function useSaleStats() {
    return useQuery({
        queryKey: ["sale-stats"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("property_sales")
                .select("property_type, status, sale_price");

            if (error) throw error;

            const stats = {
                landSales: data?.filter(s => s.property_type === "land").length || 0,
                houseSales: data?.filter(s => s.property_type === "house").length || 0,
                totalValue: data?.reduce((acc, s) => acc + Number(s.sale_price || 0), 0) || 0,
                pendingSales: data?.filter(s => s.status === "pending").length || 0,
                completedSales: data?.filter(s => s.status === "completed").length || 0,
            };

            return stats;
        },
    });
}

export function useApproveSale() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (saleId: string) => {
            const { data: user } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("property_sales")
                .update({
                    status: "approved",
                    approved_at: new Date().toISOString(),
                    approved_by: user?.user?.id
                })
                .eq("id", saleId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property-sales-management"] });
            queryClient.invalidateQueries({ queryKey: ["sale-stats"] });
        },
    });
}

export function useCompleteSale() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (saleId: string) => {
            const { data, error } = await supabase
                .from("property_sales")
                .update({ status: "completed" })
                .eq("id", saleId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property-sales-management"] });
            queryClient.invalidateQueries({ queryKey: ["sale-stats"] });
        },
    });
}
