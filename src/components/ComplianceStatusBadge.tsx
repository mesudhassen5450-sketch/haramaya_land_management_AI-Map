import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ComplianceStatusBadgeProps {
    status: "compliant" | "non_compliant" | "under_review" | "pending" | "verified" | "rejected";
    reason?: string;
    className?: string;
}

export function ComplianceStatusBadge({ status, reason, className }: ComplianceStatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case "compliant":
            case "verified":
                return {
                    icon: CheckCircle,
                    label: "Compliant",
                    variant: "default" as const,
                    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                    tooltip: "Land has verified permanent structures and is eligible for sale under Ethiopian law",
                };
            case "non_compliant":
            case "rejected":
                return {
                    icon: XCircle,
                    label: "Non-Compliant",
                    variant: "destructive" as const,
                    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
                    tooltip: reason || "Empty land cannot be sold under Ethiopian law - permanent structure required",
                };
            case "under_review":
                return {
                    icon: AlertCircle,
                    label: "Under Review",
                    variant: "secondary" as const,
                    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
                    tooltip: "Structure verification in progress - awaiting staff approval",
                };
            case "pending":
                return {
                    icon: Clock,
                    label: "Pending",
                    variant: "outline" as const,
                    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                    tooltip: "Awaiting structure verification",
                };
            default:
                return {
                    icon: AlertCircle,
                    label: "Unknown",
                    variant: "outline" as const,
                    className: "",
                    tooltip: "Status unknown",
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant={config.variant}
                        className={cn(
                            "flex items-center gap-1.5 cursor-help",
                            config.className,
                            className
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{config.label}</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p className="text-sm">{config.tooltip}</p>
                    {reason && reason !== config.tooltip && (
                        <p className="text-xs text-muted-foreground mt-1">{reason}</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
