import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PropertyValuation = Database["public"]["Tables"]["property_valuations"]["Row"];
type PropertyValuationInsert = Database["public"]["Tables"]["property_valuations"]["Insert"];
type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];

export interface ValuationWithDetails extends PropertyValuation {
  land_parcels: (LandParcel & {
    land_owners: LandOwner | null;
  }) | null;
}

export function usePropertyValuations() {
  return useQuery({
    queryKey: ["property-valuations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_valuations")
        .select(`
          *,
          land_parcels (
            *,
            land_owners (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ValuationWithDetails[];
    },
  });
}

export function useCreateValuation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (valuation: PropertyValuationInsert) => {
      const { data, error } = await supabase
        .from("property_valuations")
        .insert(valuation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-valuations"] });
    },
  });
}

export function useUpdateValuation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PropertyValuation> & { id: string }) => {
      const { data, error } = await supabase
        .from("property_valuations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-valuations"] });
    },
  });
}

export function useValuationStats() {
  return useQuery({
    queryKey: ["valuation-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_valuations")
        .select("assessed_value, market_value, is_current, approved_at");

      if (error) throw error;

      const currentValuations = data?.filter((v) => v.is_current) || [];
      const totalAssessed = currentValuations.reduce((sum, v) => sum + Number(v.assessed_value), 0);
      const totalMarket = currentValuations.reduce((sum, v) => sum + Number(v.market_value || 0), 0);
      const pending = currentValuations.filter((v) => !v.approved_at).length;
      const approved = currentValuations.filter((v) => v.approved_at).length;

      return {
        totalAssessedValue: totalAssessed,
        totalMarketValue: totalMarket,
        totalValuations: currentValuations.length,
        pendingApproval: pending,
        approved,
      };
    },
  });
}
