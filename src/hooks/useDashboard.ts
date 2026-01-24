import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Fetch all data in parallel
      const [parcelsRes, taxRes, paymentsRes, disputesRes] = await Promise.all([
        supabase.from("land_parcels").select("id, status, land_use, area_sqm"),
        supabase.from("tax_assessments").select("id, status, tax_amount, total_due, fiscal_year"),
        supabase.from("payments").select("id, amount, payment_date"),
        supabase.from("disputes").select("id, status"),
      ]);

      const parcels = parcelsRes.data || [];
      const taxes = taxRes.data || [];
      const payments = paymentsRes.data || [];
      const disputes = disputesRes.data || [];

      // Calculate stats
      const totalParcels = parcels.length;
      const registeredParcels = parcels.filter((p) => p.status === "registered").length;
      const pendingParcels = parcels.filter((p) => p.status === "pending").length;

      const currentYear = new Date().getFullYear();
      const currentYearTaxes = taxes.filter((t) => t.fiscal_year === currentYear);
      const totalAssessed = currentYearTaxes.reduce((sum, t) => sum + Number(t.total_due), 0);
      const paidTaxes = currentYearTaxes.filter((t) => t.status === "paid");
      const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const pendingTaxes = currentYearTaxes.filter((t) => t.status === "pending").length;
      const overdueTaxes = currentYearTaxes.filter((t) => t.status === "overdue").length;

      const openDisputes = disputes.filter((d) => d.status === "open").length;
      const resolvedDisputes = disputes.filter((d) => d.status === "resolved").length;

      // Land use breakdown
      const landUseBreakdown: Record<string, number> = {};
      parcels.forEach((p) => {
        if (p.land_use) {
          landUseBreakdown[p.land_use] = (landUseBreakdown[p.land_use] || 0) + 1;
        }
      });

      return {
        totalParcels,
        registeredParcels,
        pendingParcels,
        totalAssessed,
        totalCollected,
        collectionRate: totalAssessed > 0 ? (totalCollected / totalAssessed) * 100 : 0,
        pendingTaxes,
        overdueTaxes,
        openDisputes,
        resolvedDisputes,
        totalDisputes: disputes.length,
        landUseBreakdown,
      };
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
}
