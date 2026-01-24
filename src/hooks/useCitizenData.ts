import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];
type TaxAssessment = Database["public"]["Tables"]["tax_assessments"]["Row"];

export interface CitizenParcel extends LandParcel {
  land_owners: LandOwner | null;
  tax_assessments: (TaxAssessment & {
    payments: Payment[];
  })[];
}

export function useCitizenLandOwner() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["citizen-land-owner", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("land_owners")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as LandOwner | null;
    },
    enabled: !!user?.id,
  });
}

export function useCitizenParcels() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["citizen-parcels", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the land owner for this user
      const { data: owner } = await supabase
        .from("land_owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!owner) return [];

      // Then get parcels for this owner
      const { data, error } = await supabase
        .from("land_parcels")
        .select(`
          *,
          land_owners (*),
          property_valuations (*)
        `)
        .eq("owner_id", owner.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCitizenTaxAssessments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["citizen-tax-assessments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the land owner for this user
      const { data: owner } = await supabase
        .from("land_owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!owner) return [];

      // Get parcels for this owner
      const { data: parcels } = await supabase
        .from("land_parcels")
        .select("id")
        .eq("owner_id", owner.id);

      if (!parcels || parcels.length === 0) return [];

      const parcelIds = parcels.map((p) => p.id);

      // Get tax assessments for these parcels
      const { data, error } = await supabase
        .from("tax_assessments")
        .select(`
          *,
          land_parcels (
            *,
            land_owners (*)
          )
        `)
        .in("parcel_id", parcelIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCitizenPayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["citizen-payments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the land owner for this user
      const { data: owner } = await supabase
        .from("land_owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!owner) return [];

      // Get parcels for this owner
      const { data: parcels } = await supabase
        .from("land_parcels")
        .select("id")
        .eq("owner_id", owner.id);

      if (!parcels || parcels.length === 0) return [];

      const parcelIds = parcels.map((p) => p.id);

      // Get tax assessments for these parcels
      const { data: assessments } = await supabase
        .from("tax_assessments")
        .select("id")
        .in("parcel_id", parcelIds);

      if (!assessments || assessments.length === 0) return [];

      const assessmentIds = assessments.map((a) => a.id);

      // Get payments for these assessments
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          tax_assessments (
            *,
            land_parcels (
              *,
              land_owners (*)
            )
          )
        `)
        .in("tax_assessment_id", assessmentIds)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCitizenDisputes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["citizen-disputes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the land owner for this user
      const { data: owner } = await supabase
        .from("land_owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!owner) return [];

      // Get disputes where user is complainant
      const { data, error } = await supabase
        .from("disputes")
        .select(`
          *,
          land_parcels (*),
          complainant:land_owners!disputes_complainant_id_fkey (*),
          respondent:land_owners!disputes_respondent_id_fkey (*)
        `)
        .eq("complainant_id", owner.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

// Search public parcels
export function useSearchParcels(searchQuery: string) {
  return useQuery({
    queryKey: ["search-parcels", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data, error } = await supabase
        .from("land_parcels")
        .select(`
          *,
          land_owners (full_name)
        `)
        .or(`parcel_id.ilike.%${searchQuery}%,land_owners.full_name.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 2,
  });
}

export function useCitizenPayTax() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      taxAssessmentId,
      amount,
      paymentMethod,
    }: {
      taxAssessmentId: string;
      amount: number;
      paymentMethod: "bank" | "mobile_money" | "cash" | "cheque";
    }) => {
      // 1. Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            tax_assessment_id: taxAssessmentId,
            amount,
            payment_method: paymentMethod,
            receipt_number: `REC-${Date.now()}`,
            processed_by: user?.id,
            payment_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // 2. Update tax assessment status
      const { error: updateError } = await supabase
        .from("tax_assessments")
        .update({ status: "paid" })
        .eq("id", taxAssessmentId);

      if (updateError) throw updateError;

      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citizen-tax-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["citizen-payments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
export function useLinkOwner() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (nationalId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Check if owner exists and is not already linked
      const { data: owner, error: fetchError } = await supabase
        .from("land_owners")
        .select("id, user_id")
        .eq("national_id", nationalId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!owner) throw new Error("No record found with this National ID");
      if (owner.user_id) throw new Error("This record is already linked to another account");

      // Link user to owner
      const { error: updateError } = await supabase
        .from("land_owners")
        .update({ user_id: user.id })
        .eq("id", owner.id);

      if (updateError) throw updateError;
      return owner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citizen-land-owner"] });
      queryClient.invalidateQueries({ queryKey: ["citizen-parcels"] });
      queryClient.invalidateQueries({ queryKey: ["citizen-tax-assessments"] });
    },
  });
}
