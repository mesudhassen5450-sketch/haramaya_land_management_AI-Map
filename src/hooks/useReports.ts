import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useReportStats() {
  return useQuery({
    queryKey: ["report-stats"],
    queryFn: async () => {
      // Get various statistics for reports
      const [parcelsResult, paymentsResult, valuationsResult, disputesResult] = await Promise.all([
        supabase.from("land_parcels").select("id, land_use, zone, status, created_at"),
        supabase.from("payments").select("id, amount, payment_method, payment_date, created_at"),
        supabase.from("property_valuations").select("id, assessed_value, market_value, is_current"),
        supabase.from("disputes").select("id, status, dispute_type, priority, created_at"),
      ]);

      const parcels = parcelsResult.data || [];
      const payments = paymentsResult.data || [];
      const valuations = valuationsResult.data || [];
      const disputes = disputesResult.data || [];

      // Calculate stats
      const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthPayments = payments.filter(
        (p) => new Date(p.payment_date || p.created_at || "") >= thisMonth
      );
      const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      // Revenue by zone
      const revenueByZone: Record<string, number> = {};
      
      // Parcels by land use
      const parcelsByLandUse = parcels.reduce((acc, p) => {
        const use = p.land_use || "other";
        acc[use] = (acc[use] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Parcels by status
      const parcelsByStatus = parcels.reduce((acc, p) => {
        const status = p.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Disputes by status
      const disputesByStatus = disputes.reduce((acc, d) => {
        const status = d.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Valuations
      const currentValuations = valuations.filter((v) => v.is_current);
      const totalAssessedValue = currentValuations.reduce((sum, v) => sum + Number(v.assessed_value), 0);

      return {
        totalParcels: parcels.length,
        totalPayments: payments.length,
        totalRevenue,
        monthlyRevenue,
        parcelsByLandUse,
        parcelsByStatus,
        disputesByStatus,
        totalDisputes: disputes.length,
        totalValuations: currentValuations.length,
        totalAssessedValue,
      };
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });
}
