import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateDispute, type DisputeWithDetails } from "@/hooks/useDisputes";
import { toast } from "sonner";

interface EditDisputeDialogProps {
  dispute: DisputeWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDisputeDialog({ dispute, open, onOpenChange }: EditDisputeDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dispute_type: "boundary",
    priority: "medium",
    status: "open" as string,
    resolution_notes: "",
  });

  const updateDispute = useUpdateDispute();

  useEffect(() => {
    if (dispute) {
      setFormData({
        title: dispute.title,
        description: dispute.description,
        dispute_type: dispute.dispute_type,
        priority: dispute.priority || "medium",
        status: dispute.status as any || "open",
        resolution_notes: dispute.resolution_notes || "",
      });
    }
  }, [dispute]);

  const handleSubmit = async () => {
    if (!dispute) return;

    const isResolved = formData.status === "resolved" || formData.status === "closed";

    try {
      await updateDispute.mutateAsync({
        id: dispute.id,
        title: formData.title,
        description: formData.description,
        dispute_type: formData.dispute_type as any,
        priority: formData.priority,
        status: formData.status as any,
        resolution_notes: formData.resolution_notes || null,
        resolved_at: isResolved && !dispute.resolved_at ? new Date().toISOString() : dispute.resolved_at,
      });
      toast.success("Dispute updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update dispute");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Dispute - {dispute?.dispute_id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={formData.dispute_type} onValueChange={(v) => setFormData({ ...formData, dispute_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boundary">Boundary</SelectItem>
                  <SelectItem value="ownership">Ownership</SelectItem>
                  <SelectItem value="valuation_appeal">Valuation Appeal</SelectItem>
                  <SelectItem value="encroachment">Encroachment</SelectItem>
                  <SelectItem value="double_registration">Double Registration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {(formData.status === "resolved" || formData.status === "closed") && (
            <div className="grid gap-2">
              <Label>Resolution Notes</Label>
              <Textarea
                value={formData.resolution_notes}
                onChange={(e) => setFormData({ ...formData, resolution_notes: e.target.value })}
                rows={3}
                placeholder="Describe how the dispute was resolved..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateDispute.isPending}>
            {updateDispute.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
