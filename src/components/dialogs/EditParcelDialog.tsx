import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateLandParcel, useLandOwners, type LandParcelWithOwner } from "@/hooks/useLandParcels";
import { toast } from "sonner";

interface EditParcelDialogProps {
  parcel: LandParcelWithOwner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditParcelDialog({ parcel, open, onOpenChange }: EditParcelDialogProps) {
  const [formData, setFormData] = useState({
    area_sqm: "",
    land_use: "residential" as const,
    location: "",
    zone: "",
    kebele: "",
    owner_id: "",
    status: "pending" as const,
    notes: "",
  });

  const { data: owners } = useLandOwners();
  const updateParcel = useUpdateLandParcel();

  useEffect(() => {
    if (parcel) {
      setFormData({
        area_sqm: parcel.area_sqm.toString(),
        land_use: parcel.land_use as any,
        location: parcel.location || "",
        zone: parcel.zone || "",
        kebele: parcel.kebele || "",
        owner_id: parcel.owner_id || "",
        status: parcel.status as any || "pending",
        notes: parcel.notes || "",
      });
    }
  }, [parcel]);

  const handleSubmit = async () => {
    if (!parcel) return;

    try {
      await updateParcel.mutateAsync({
        id: parcel.id,
        area_sqm: parseFloat(formData.area_sqm),
        land_use: formData.land_use,
        location: formData.location || null,
        zone: formData.zone || null,
        kebele: formData.kebele || null,
        owner_id: formData.owner_id || null,
        status: formData.status,
        notes: formData.notes || null,
      });
      toast.success("Parcel updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update parcel");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Land Parcel - {parcel?.parcel_id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Owner</Label>
            <Select value={formData.owner_id} onValueChange={(v) => setFormData({ ...formData, owner_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
              <SelectContent>
                {owners?.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Area (m²)</Label>
              <Input
                type="number"
                value={formData.area_sqm}
                onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Land Use</Label>
              <Select value={formData.land_use} onValueChange={(v: any) => setFormData({ ...formData, land_use: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Zone</Label>
              <Input value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Kebele</Label>
              <Input value={formData.kebele} onChange={(e) => setFormData({ ...formData, kebele: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateParcel.isPending}>
            {updateParcel.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
