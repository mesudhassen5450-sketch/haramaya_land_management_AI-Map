import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { TaxAssessmentWithDetails } from "@/hooks/useTaxAssessments";

interface ViewTaxDialogProps {
  tax: TaxAssessmentWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export function ViewTaxDialog({ tax, open, onOpenChange, onEdit }: ViewTaxDialogProps) {
  if (!tax) return null;

  const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "paid": return "badge-status-active";
      case "pending": return "badge-status-pending";
      case "overdue": return "badge-status-overdue";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon = tax.status === "paid" ? CheckCircle : tax.status === "overdue" ? AlertCircle : Clock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {tax.tax_id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(tax.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {tax.status}
            </Badge>
            <Badge variant="outline">FY {tax.fiscal_year}</Badge>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Property</p>
            <p className="font-semibold text-primary">{tax.land_parcels?.parcel_id || "N/A"}</p>
            <p className="text-sm">{tax.land_parcels?.land_owners?.full_name || "Unknown Owner"}</p>
            <p className="text-xs text-muted-foreground capitalize mt-1">{tax.land_parcels?.land_use}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assessed Value</p>
              <p className="font-medium">{formatCurrency(Number(tax.assessed_value))}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tax Rate</p>
              <p className="font-medium">{(Number(tax.tax_rate) * 100).toFixed(2)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tax Amount</p>
              <p className="font-medium">{formatCurrency(Number(tax.tax_amount))}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Penalty</p>
              <p className="font-medium text-destructive">{formatCurrency(Number(tax.penalty_amount || 0))}</p>
            </div>
            {tax.exemption_amount && Number(tax.exemption_amount) > 0 && (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exemption</p>
                  <p className="font-medium text-green-600">-{formatCurrency(Number(tax.exemption_amount))}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exemption Type</p>
                  <p className="font-medium capitalize">{tax.exemption_type}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Due</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(Number(tax.total_due))}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Due Date: {tax.due_date}
          </div>

          {tax.notes && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{tax.notes}</p>
            </div>
          )}

          {onEdit && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={onEdit}>Edit Assessment</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
