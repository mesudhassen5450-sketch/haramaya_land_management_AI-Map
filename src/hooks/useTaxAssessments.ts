import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TaxAssessment = Database["public"]["Tables"]["tax_assessments"]["Row"];
type TaxAssessmentInsert = Database["public"]["Tables"]["tax_assessments"]["Insert"];
type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];

export interface TaxAssessmentWithDetails extends TaxAssessment {
  land_parcels: (LandParcel & {
    land_owners: LandOwner | null;
  }) | null;
}

export function useTaxAssessments() {
  return useQuery({
    queryKey: ["tax-assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_assessments")
        .select(`
          *,
          land_parcels (
            *,
            land_owners (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaxAssessmentWithDetails[];
    },
  });
}

export function useCreateTaxAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessment: Omit<TaxAssessmentInsert, "tax_id">) => {
      const { data, error } = await supabase
        .from("tax_assessments")
        .insert([{ ...assessment, tax_id: "" }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-assessments"] });
    },
  });
}

export function useUpdateTaxAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TaxAssessment> & { id: string }) => {
      const { data, error } = await supabase
        .from("tax_assessments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-assessments"] });
    },
  });
}

export function useTaxRates() {
  return useQuery({
    queryKey: ["tax-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_rates")
        .select("*")
        .is("effective_to", null)
        .order("land_use");

      if (error) throw error;
      return data;
    },
  });
}
