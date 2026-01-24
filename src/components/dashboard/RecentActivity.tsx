import { FileText, CreditCard, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentActivity } from "@/hooks/useDashboard";
import { formatDistanceToNow } from "date-fns";

const activityIcons: Record<string, { icon: typeof FileText; color: string }> = {
  registration: { icon: FileText, color: "text-primary" },
  land_parcel: { icon: FileText, color: "text-primary" },
  payment: { icon: CreditCard, color: "text-success" },
  dispute: { icon: AlertTriangle, color: "text-warning" },
  approval: { icon: CheckCircle, color: "text-accent" },
  tax_assessment: { icon: CreditCard, color: "text-primary" },
  valuation: { icon: FileText, color: "text-accent" },
  default: { icon: FileText, color: "text-muted-foreground" },
};

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity();

  const getActivityConfig = (entityType: string) => {
    return activityIcons[entityType] || activityIcons.default;
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Just now";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = getActivityConfig(activity.entity_type);
            const Icon = config.icon;
            
            return (
              <div key={activity.id} className="flex gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    "bg-muted"
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate capitalize">
                    {activity.action.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {activity.entity_type.replace(/_/g, " ")}
                    {activity.entity_id && ` - ${activity.entity_id.slice(0, 8)}...`}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatTime(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      )}
    </div>
  );
}
