import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type TaxAssessment = Database["public"]["Tables"]["tax_assessments"]["Row"];
type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];
type LandOwner = Database["public"]["Tables"]["land_owners"]["Row"];

export interface PaymentWithDetails extends Payment {
  tax_assessments: (TaxAssessment & {
    land_parcels: (LandParcel & {
      land_owners: LandOwner | null;
    }) | null;
  }) | null;
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentWithDetails[];
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: Omit<PaymentInsert, "receipt_number">) => {
      const { data, error } = await supabase
        .from("payments")
        .insert([{ ...payment, receipt_number: "" }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["tax-assessments"] });
    },
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from("payments")
        .select("amount, payment_date, payment_method");

      if (error) throw error;

      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();

      const totalCollected = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const thisMonthPayments = payments?.filter((p) => {
        const date = new Date(p.payment_date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }) || [];
      const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      const byMethod: Record<string, number> = {};
      payments?.forEach((p) => {
        byMethod[p.payment_method] = (byMethod[p.payment_method] || 0) + Number(p.amount);
      });

      return {
        totalCollected,
        thisMonthTotal,
        transactionCount: payments?.length || 0,
        byMethod,
      };
    },
  });
}
