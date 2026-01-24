import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PropertySale {
  id: string;
  parcel_id: string;
  seller_id: string;
  title: string;
  description: string;
  listing_type: 'land' | 'house';
  price: number;
  status: 'available' | 'sold' | 'pending';
  images: string[];
  created_at: string;
  updated_at: string;
  land_parcels?: {
    parcel_id: string;
    area_sqm: number;
    location: string;
    kebele: string;
  };
}

export function usePropertySales(type?: 'land' | 'house') {
  return useQuery({
    queryKey: ["property-sales", type],
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
          )
        `)
        .eq("status", "available");

      if (type) {
        query = query.eq("listing_type", type);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as PropertySale[];
    },
  });
}

export function useCreatePropertySale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSale: Partial<PropertySale>) => {
      const { data, error } = await supabase
        .from("property_sales")
        .insert([newSale])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-sales"] });
      toast.success("Property listed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to list property");
    },
  });
}

export function useUpdatePropertySale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PropertySale> & { id: string }) => {
      const { data, error } = await supabase
        .from("property_sales")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-sales"] });
      toast.success("Property updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update property");
    },
  });
}

export function useDeletePropertySale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("property_sales")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-sales"] });
      toast.success("Property listing removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete property");
    },
  });
}

// Additional hooks for sales management pages
export function useSaleStats() {
  return useQuery({
    queryKey: ['sale-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('property_sales').select('property_type, status, sale_price');
      if (error) throw error;
      return {
        landSales: data?.filter(s => s.property_type === 'land').length || 0,
        houseSales: data?.filter(s => s.property_type === 'house').length || 0,
        totalValue: data?.reduce((acc, s) => acc + Number(s.sale_price || 0), 0) || 0,
        pendingSales: data?.filter(s => s.status === 'pending').length || 0,
        completedSales: data?.filter(s => s.status === 'completed').length || 0,
      };
    },
  });
}

export function useApproveSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (saleId: string) => {
      const { data, error } = await supabase.from('property_sales').update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: (await supabase.auth.getUser()).data.user?.id }).eq('id', saleId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-stats'] });
    },
  });
}

export function useCompleteSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (saleId: string) => {
      const { data, error } = await supabase.from('property_sales').update({ status: 'completed' }).eq('id', saleId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-stats'] });
    },
  });
}
