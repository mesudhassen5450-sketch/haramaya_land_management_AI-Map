import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandParcelInsert = Database["public"]["Tables"]["land_parcels"]["Insert"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];

export interface LandParcelWithOwner extends LandParcel {
  land_owners: LandOwner | null;
}

export function useLandParcels() {
  return useQuery({
    queryKey: ["land-parcels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("land_parcels")
        .select(`
          *,
          land_owners (*),
          tax_assessments (
            status,
            fiscal_year,
            tax_amount,
            total_due
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (LandParcelWithOwner & {
        tax_assessments: {
          status: Database["public"]["Enums"]["payment_status"] | null;
          fiscal_year: number;
          tax_amount: number;
          total_due: number;
        }[]
      })[];
    },
  });
}

export function useLandParcel(id: string) {
  return useQuery({
    queryKey: ["land-parcel", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("land_parcels")
        .select(`
          *,
          land_owners (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as LandParcelWithOwner;
    },
    enabled: !!id,
  });
}

export function useCreateLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parcel: Omit<LandParcelInsert, "parcel_id">) => {
      const generatedId = `HP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await supabase
        .from("land_parcels")
        .insert([{ ...parcel, parcel_id: generatedId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] });
    },
  });
}

export function useUpdateLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LandParcel> & { id: string }) => {
      const { data, error } = await supabase
        .from("land_parcels")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] });
    },
  });
}

export function useLandOwners() {
  return useQuery({
    queryKey: ["land-owners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("land_owners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLandOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (owner: Database["public"]["Tables"]["land_owners"]["Insert"]) => {
      const { data, error } = await supabase
        .from("land_owners")
        .insert(owner)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-owners"] });
    },
  });
}
