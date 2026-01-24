import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Dispute = Database["public"]["Tables"]["disputes"]["Row"];
type DisputeInsert = Database["public"]["Tables"]["disputes"]["Insert"];
type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];

export interface DisputeWithDetails extends Dispute {
  land_parcels: LandParcel | null;
  complainant: LandOwner | null;
  respondent: LandOwner | null;
}

export function useDisputes() {
  return useQuery({
    queryKey: ["disputes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select(`
          *,
          land_parcels (*),
          complainant:complainant_id (*),
          respondent:respondent_id (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as DisputeWithDetails[];
    },
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dispute: Omit<DisputeInsert, "dispute_id">) => {
      const { data, error } = await supabase
        .from("disputes")
        .insert([{ ...dispute, dispute_id: "" }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export function useUpdateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Dispute> & { id: string }) => {
      const { data, error } = await supabase
        .from("disputes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export function useDisputeStats() {
  return useQuery({
    queryKey: ["dispute-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select("status, priority");

      if (error) throw error;

      const byStatus: Record<string, number> = {};
      const byPriority: Record<string, number> = {};

      data?.forEach((d) => {
        byStatus[d.status] = (byStatus[d.status] || 0) + 1;
        if (d.priority) {
          byPriority[d.priority] = (byPriority[d.priority] || 0) + 1;
        }
      });

      return {
        total: data?.length || 0,
        byStatus,
        byPriority,
        open: byStatus.open || 0,
        resolved: byStatus.resolved || 0,
      };
    },
  });
}
