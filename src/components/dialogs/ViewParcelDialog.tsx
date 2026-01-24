import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, FileText } from "lucide-react";
import type { LandParcelWithOwner } from "@/hooks/useLandParcels";

interface ViewParcelDialogProps {
  parcel: LandParcelWithOwner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function ViewParcelDialog({ parcel, open, onOpenChange, onEdit }: ViewParcelDialogProps) {
  if (!parcel) return null;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "registered": return "badge-status-active";
      case "pending": return "badge-status-pending";
      case "disputed": return "badge-status-overdue";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {parcel.parcel_id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(parcel.status)}>
              {parcel.status || "Unknown"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {parcel.land_use}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-medium flex items-center gap-1">
                <User className="w-4 h-4" />
                {parcel.land_owners?.full_name || "Unknown"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="font-medium">{parcel.area_sqm.toLocaleString()} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Zone</p>
              <p className="font-medium">{parcel.zone || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Kebele</p>
              <p className="font-medium">{parcel.kebele || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{parcel.location || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Title Deed</p>
              <p className="font-medium">{parcel.title_deed_number || "N/A"}</p>
            </div>
          </div>

          {parcel.notes && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <FileText className="w-4 h-4" /> Notes
              </p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{parcel.notes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Registered: {parcel.registration_date || parcel.created_at?.split("T")[0]}
          </div>

          {onEdit && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={onEdit}>Edit Parcel</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
