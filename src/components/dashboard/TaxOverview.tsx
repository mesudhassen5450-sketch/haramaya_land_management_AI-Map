import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";

export function TaxOverview() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const totalCollected = stats?.totalCollected || 0;
  const totalTarget = stats?.totalAssessed || 0;
  const percentageAchieved = totalTarget > 0 ? ((totalCollected / totalTarget) * 100).toFixed(1) : "0";

  // Create monthly breakdown based on collection rate
  const currentYear = new Date().getFullYear();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const taxData = months.map((month, index) => {
    const monthlyTarget = totalTarget / 12;
    const monthlyCollected = index < new Date().getMonth() 
      ? (totalCollected / Math.max(new Date().getMonth(), 1)) 
      : 0;
    return {
      month,
      collected: monthlyCollected / 1000000, // Convert to millions
      target: monthlyTarget / 1000000,
    };
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Tax Collection Overview</h3>
        <span className="text-xs text-muted-foreground">Fiscal Year {currentYear}</span>
      </div>

      {/* Progress Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ETB {(totalCollected / 1000000).toFixed(1)}M
            </span>
            <span className="text-sm text-muted-foreground">
              / {(totalTarget / 1000000).toFixed(1)}M target
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {Number(percentageAchieved) >= 100 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-warning" />
            )}
            <span
              className={
                Number(percentageAchieved) >= 100
                  ? "text-sm text-success"
                  : "text-sm text-warning"
              }
            >
              {percentageAchieved}% of target
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold text-foreground">{stats?.pendingTaxes || 0}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold text-foreground">{stats?.overdueTaxes || 0}</p>
          <p className="text-xs text-muted-foreground">Overdue</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold text-foreground">{stats?.collectionRate?.toFixed(0) || 0}%</p>
          <p className="text-xs text-muted-foreground">Collection Rate</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="text-foreground font-medium">{percentageAchieved}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              Number(percentageAchieved) >= 100 ? "bg-success" : "bg-primary"
            }`}
            style={{ width: `${Math.min(Number(percentageAchieved), 100)}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Collected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Target Met</span>
        </div>
      </div>
    </div>
  );
}
