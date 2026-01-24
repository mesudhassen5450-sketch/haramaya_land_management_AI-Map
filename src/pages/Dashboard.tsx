import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TaxOverview } from "@/components/dashboard/TaxOverview";
import { LandParcelsTable } from "@/components/dashboard/LandParcelsTable";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Map, Users, Receipt, AlertTriangle } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useLandOwners } from "@/hooks/useLandParcels";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { LandUseChart } from "@/components/dashboard/LandUseChart";
import { ParcelStatusChart } from "@/components/dashboard/ParcelStatusChart";
import { Button } from "@/components/ui/button";

export default function Dashboard() {

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: owners, isLoading: ownersLoading } = useLandOwners();
  const [tableFilter, setTableFilter] = useState<string>("all");

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `ETB ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `ETB ${(amount / 1000).toFixed(1)}K`;
    }
    return `ETB ${amount.toFixed(0)}`;
  };

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Haramaya Wereda Land & Tax Management Overview"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Land Parcels"
              value={stats?.totalParcels || 0}
              change={`${stats?.registeredParcels || 0} registered`}
              changeType="positive"
              icon={Map}
              variant="primary"
            />
            <StatCard
              title="Registered Owners"
              value={owners?.length || 0}
              change={`${stats?.pendingParcels || 0} pending parcels`}
              changeType={stats?.pendingParcels ? "neutral" : "positive"}
              icon={Users}
              variant="gold"
            />
            <StatCard
              title="Tax Collected (YTD)"
              value={formatCurrency(stats?.totalCollected || 0)}
              change={`${stats?.collectionRate?.toFixed(0) || 0}% of target`}
              changeType={stats?.collectionRate && stats.collectionRate >= 80 ? "positive" : "neutral"}
              icon={Receipt}
              variant="success"
            />
            <StatCard
              title="Active Disputes"
              value={stats?.openDisputes || 0}
              change={`${stats?.resolvedDisputes || 0} resolved`}
              changeType="neutral"
              icon={AlertTriangle}
            />
          </>
        )}
      </div>

      {/* Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart />
      </div>

      {/* Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <ParcelStatusChart />
        <LandUseChart />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TaxOverview />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant={tableFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTableFilter("all")}
            >
              All Parcels
            </Button>
            <Button
              variant={tableFilter === "registered" ? "default" : "outline"}
              size="sm"
              onClick={() => setTableFilter("registered")}
            >
              Active / Registered
            </Button>
            <Button
              variant={tableFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setTableFilter("pending")}
            >
              Pending Approval
            </Button>
          </div>
          <LandParcelsTable filter={tableFilter} />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
}
