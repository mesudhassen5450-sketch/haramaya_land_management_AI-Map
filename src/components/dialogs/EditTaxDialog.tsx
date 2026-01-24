import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateTaxAssessment, type TaxAssessmentWithDetails } from "@/hooks/useTaxAssessments";
import { toast } from "sonner";

interface EditTaxDialogProps {
  tax: TaxAssessmentWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaxDialog({ tax, open, onOpenChange }: EditTaxDialogProps) {
  const [formData, setFormData] = useState({
    due_date: "",
    status: "pending" as const,
    penalty_amount: "0",
    exemption_amount: "0",
    exemption_type: "",
    notes: "",
  });

  const updateTax = useUpdateTaxAssessment();

  useEffect(() => {
    if (tax) {
      setFormData({
        due_date: tax.due_date,
        status: tax.status as any || "pending",
        penalty_amount: tax.penalty_amount?.toString() || "0",
        exemption_amount: tax.exemption_amount?.toString() || "0",
        exemption_type: tax.exemption_type || "",
        notes: tax.notes || "",
      });
    }
  }, [tax]);

  const handleSubmit = async () => {
    if (!tax) return;

    const penalty = parseFloat(formData.penalty_amount) || 0;
    const exemption = parseFloat(formData.exemption_amount) || 0;
    const total = Number(tax.tax_amount) + penalty - exemption;

    try {
      await updateTax.mutateAsync({
        id: tax.id,
        due_date: formData.due_date,
        status: formData.status,
        penalty_amount: penalty,
        exemption_amount: exemption,
        exemption_type: formData.exemption_type || null,
        total_due: total,
        notes: formData.notes || null,
      });
      toast.success("Tax assessment updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update assessment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Tax Assessment - {tax?.tax_id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p><strong>Property:</strong> {tax?.land_parcels?.parcel_id}</p>
            <p><strong>Owner:</strong> {tax?.land_parcels?.land_owners?.full_name}</p>
            <p><strong>Base Tax:</strong> ETB {Number(tax?.tax_amount || 0).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Penalty Amount (ETB)</Label>
              <Input
                type="number"
                value={formData.penalty_amount}
                onChange={(e) => setFormData({ ...formData, penalty_amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Exemption Amount (ETB)</Label>
              <Input
                type="number"
                value={formData.exemption_amount}
                onChange={(e) => setFormData({ ...formData, exemption_amount: e.target.value })}
              />
            </div>
          </div>

          {parseFloat(formData.exemption_amount) > 0 && (
            <div className="grid gap-2">
              <Label>Exemption Type</Label>
              <Select value={formData.exemption_type} onValueChange={(v) => setFormData({ ...formData, exemption_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior">Senior Citizen</SelectItem>
                  <SelectItem value="disability">Disability</SelectItem>
                  <SelectItem value="veteran">Veteran</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Calculated Total Due</p>
            <p className="text-xl font-bold text-primary">
              ETB {(Number(tax?.tax_amount || 0) + parseFloat(formData.penalty_amount || "0") - parseFloat(formData.exemption_amount || "0")).toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateTax.isPending}>
            {updateTax.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
