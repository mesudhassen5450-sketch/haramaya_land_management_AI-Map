import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUpdateValuation, type ValuationWithDetails } from "@/hooks/usePropertyValuations";
import { toast } from "sonner";

interface EditValuationDialogProps {
  valuation: ValuationWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditValuationDialog({ valuation, open, onOpenChange }: EditValuationDialogProps) {
  const [formData, setFormData] = useState({
    assessed_value: "",
    market_value: "",
    valuation_method: "standard",
    location_factor: "1.0",
    infrastructure_score: "5",
    is_current: true,
    notes: "",
    approve: false,
  });

  const updateValuation = useUpdateValuation();

  useEffect(() => {
    if (valuation) {
      setFormData({
        assessed_value: valuation.assessed_value.toString(),
        market_value: valuation.market_value?.toString() || "",
        valuation_method: valuation.valuation_method || "standard",
        location_factor: valuation.location_factor?.toString() || "1.0",
        infrastructure_score: valuation.infrastructure_score?.toString() || "5",
        is_current: valuation.is_current ?? true,
        notes: valuation.notes || "",
        approve: !!valuation.approved_at,
      });
    }
  }, [valuation]);

  const handleSubmit = async () => {
    if (!valuation) return;

    try {
      await updateValuation.mutateAsync({
        id: valuation.id,
        assessed_value: parseFloat(formData.assessed_value),
        market_value: formData.market_value ? parseFloat(formData.market_value) : null,
        valuation_method: formData.valuation_method,
        location_factor: parseFloat(formData.location_factor),
        infrastructure_score: parseInt(formData.infrastructure_score),
        is_current: formData.is_current,
        notes: formData.notes || null,
        approved_at: formData.approve && !valuation.approved_at ? new Date().toISOString() : valuation.approved_at,
      });
      toast.success("Valuation updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update valuation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Valuation - {valuation?.land_parcels?.parcel_id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Assessed Value (ETB)</Label>
              <Input
                type="number"
                value={formData.assessed_value}
                onChange={(e) => setFormData({ ...formData, assessed_value: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Market Value (ETB)</Label>
              <Input
                type="number"
                value={formData.market_value}
                onChange={(e) => setFormData({ ...formData, market_value: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Location Factor</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.location_factor}
                onChange={(e) => setFormData({ ...formData, location_factor: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Infrastructure Score (0-10)</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.infrastructure_score}
                onChange={(e) => setFormData({ ...formData, infrastructure_score: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Valuation Method</Label>
            <Select value={formData.valuation_method} onValueChange={(v) => setFormData({ ...formData, valuation_method: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="comparative">Comparative</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(c) => setFormData({ ...formData, is_current: c as boolean })}
              />
              <Label htmlFor="is_current">Current Valuation</Label>
            </div>
            {!valuation?.approved_at && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="approve"
                  checked={formData.approve}
                  onCheckedChange={(c) => setFormData({ ...formData, approve: c as boolean })}
                />
                <Label htmlFor="approve">Approve Valuation</Label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateValuation.isPending}>
            {updateValuation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
