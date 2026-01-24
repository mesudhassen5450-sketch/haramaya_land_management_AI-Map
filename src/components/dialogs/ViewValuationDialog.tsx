import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, CheckCircle, Clock } from "lucide-react";
import type { ValuationWithDetails } from "@/hooks/usePropertyValuations";

interface ViewValuationDialogProps {
  valuation: ValuationWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function ViewValuationDialog({ valuation, open, onOpenChange, onEdit }: ViewValuationDialogProps) {
  if (!valuation) return null;

  const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;
  const approved = !!valuation.approved_at;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Valuation Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={approved ? "badge-status-active" : "badge-status-pending"}>
              {approved ? <><CheckCircle className="w-3 h-3 mr-1" /> Approved</> : <><Clock className="w-3 h-3 mr-1" /> Pending</>}
            </Badge>
            <Badge variant="outline">{valuation.valuation_method || "Standard"}</Badge>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Parcel</p>
            <p className="font-semibold text-primary">{valuation.land_parcels?.parcel_id || "N/A"}</p>
            <p className="text-sm">{valuation.land_parcels?.land_owners?.full_name || "Unknown Owner"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assessed Value</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(Number(valuation.assessed_value))}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Market Value</p>
              <p className="text-xl font-bold">{valuation.market_value ? formatCurrency(Number(valuation.market_value)) : "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location Factor</p>
              <p className="font-medium">{valuation.location_factor || 1.0}x</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Infrastructure Score</p>
              <p className="font-medium">{valuation.infrastructure_score ?? 0}/10</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="font-medium capitalize">{valuation.land_parcels?.land_use || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="font-medium">{valuation.land_parcels?.area_sqm?.toLocaleString() || 0} m²</p>
            </div>
          </div>

          {valuation.notes && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{valuation.notes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Valuation Date: {valuation.valuation_date}
          </div>

          {onEdit && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={onEdit}>Edit Valuation</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
