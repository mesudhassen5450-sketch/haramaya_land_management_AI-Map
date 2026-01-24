import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Calendar, User, MapPin, AlertTriangle } from "lucide-react";
import type { DisputeWithDetails } from "@/hooks/useDisputes";

interface ViewDisputeDialogProps {
  dispute: DisputeWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function ViewDisputeDialog({ dispute, open, onOpenChange, onEdit }: ViewDisputeDialogProps) {
  if (!dispute) return null;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "resolved":
      case "closed": return "badge-status-active";
      case "under_review": return "badge-status-pending";
      case "escalated": return "badge-status-overdue";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "badge-status-overdue";
      case "medium": return "badge-status-pending";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            {dispute.dispute_id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status?.replace(/_/g, " ")}
            </Badge>
            <Badge className={getPriorityColor(dispute.priority)}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {dispute.priority}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {dispute.dispute_type?.replace(/_/g, " ")}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-lg">{dispute.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{dispute.description}</p>
          </div>

          {dispute.land_parcels && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Related Property
              </p>
              <p className="font-semibold text-primary">{dispute.land_parcels.parcel_id}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" /> Complainant
              </p>
              <p className="font-medium">{dispute.complainant?.full_name || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" /> Respondent
              </p>
              <p className="font-medium">{dispute.respondent?.full_name || "N/A"}</p>
            </div>
          </div>

          {dispute.resolution_notes && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Resolution Notes</p>
              <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                {dispute.resolution_notes}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Filed: {dispute.created_at?.split("T")[0]}
            </span>
            {dispute.resolved_at && (
              <span>Resolved: {dispute.resolved_at.split("T")[0]}</span>
            )}
          </div>

          {onEdit && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={onEdit}>Edit Case</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
