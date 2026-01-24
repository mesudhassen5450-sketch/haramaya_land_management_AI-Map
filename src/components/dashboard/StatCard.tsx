import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "primary" | "gold" | "success";
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "bg-card border border-border",
    primary: "stat-card-primary border-0",
    gold: "stat-card-gold border-0",
    success: "stat-card-success border-0",
  };

  const textClasses = {
    default: {
      title: "text-muted-foreground",
      value: "text-foreground",
      icon: "text-primary bg-primary/10",
    },
    primary: {
      title: "text-primary-foreground/80",
      value: "text-primary-foreground",
      icon: "text-primary-foreground bg-primary-foreground/20",
    },
    gold: {
      title: "text-secondary-foreground/80",
      value: "text-secondary-foreground",
      icon: "text-secondary-foreground bg-secondary-foreground/20",
    },
    success: {
      title: "text-accent-foreground/80",
      value: "text-accent-foreground",
      icon: "text-accent-foreground bg-accent-foreground/20",
    },
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-slide-up",
        variantClasses[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn("text-sm font-medium", textClasses[variant].title)}>
            {title}
          </p>
          <p className={cn("text-2xl font-bold", textClasses[variant].value)}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && textClasses[variant].title
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            textClasses[variant].icon
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
