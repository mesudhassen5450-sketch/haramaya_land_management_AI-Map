import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  Download,
  MapPin,
  Eye,
  Edit,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLandParcels, useLandOwners, useCreateLandParcel, useCreateLandOwner, useUpdateLandParcel } from "@/hooks/useLandParcels";
import { RegistrationTrendChart } from "@/components/charts/RegistrationTrendChart";
import { LandTypeDistributionChart } from "@/components/charts/LandTypeDistributionChart";
import { toast } from "sonner";

export default function LandRegistration() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);

  // Form state for new parcel
  const [newParcel, setNewParcel] = useState({
    area_sqm: "",
    land_use: "residential" as const,
    location: "",
    zone: "",
    kebele: "",
    owner_id: "",
    notes: "",
  });

  // Form state for new owner
  const [newOwner, setNewOwner] = useState({
    full_name: "",
    email: "",
    phone: "",
    national_id: "",
    address: "",
    kebele: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = searchParams.get("edit") === "true";
  const isViewMode = editId && !isEditMode;
  const [editingParcelId, setEditingParcelId] = useState<string | null>(null);
  const [viewOnly, setViewOnly] = useState(false);

  const { data: parcels, isLoading } = useLandParcels();
  const { data: owners } = useLandOwners();
  const createParcel = useCreateLandParcel();
  const updateParcel = useUpdateLandParcel();
  const createOwner = useCreateLandOwner();

  useEffect(() => {
    if (editId && parcels) {
      const parcel = parcels.find(p => p.id === editId);
      if (parcel) {
        setNewParcel({
          area_sqm: parcel.area_sqm.toString(),
          land_use: parcel.land_use as any,
          location: parcel.location || "",
          zone: parcel.zone || "",
          kebele: parcel.kebele || "",
          owner_id: parcel.owner_id || "",
          notes: parcel.notes || "",
        });
        if (isEditMode) {
          setEditingParcelId(editId);
          setViewOnly(false);
          setIsDialogOpen(true);
        } else if (isViewMode) {
          setViewOnly(true);
          setIsDialogOpen(true);
        }
      }
    }
  }, [editId, parcels, isEditMode]);

  const filteredParcels = parcels?.filter((parcel) => {
    const matchesSearch =
      parcel.parcel_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.land_owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || parcel.land_use === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  const handleCreateParcel = async () => {
    if (!newParcel.area_sqm || !newParcel.owner_id) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      if (editingParcelId) {
        await updateParcel.mutateAsync({
          id: editingParcelId,
          area_sqm: parseFloat(newParcel.area_sqm),
          land_use: newParcel.land_use,
          location: newParcel.location || null,
          zone: newParcel.zone || null,
          kebele: newParcel.kebele || null,
          owner_id: newParcel.owner_id,
          notes: newParcel.notes || null,
        });
        toast.success("Land parcel updated successfully");
      } else {
        await createParcel.mutateAsync({
          area_sqm: parseFloat(newParcel.area_sqm),
          land_use: newParcel.land_use,
          location: newParcel.location || null,
          zone: newParcel.zone || null,
          kebele: newParcel.kebele || null,
          owner_id: newParcel.owner_id,
          notes: newParcel.notes || null,
        });
        toast.success("Land parcel registered successfully");
      }

      setIsDialogOpen(false);
      setEditingParcelId(null);
      setViewOnly(false);
      setSearchParams({});
      setNewParcel({
        area_sqm: "",
        land_use: "residential",
        location: "",
        zone: "",
        kebele: "",
        owner_id: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to save parcel");
    }
  };

  const handleCreateOwner = async () => {
    if (!newOwner.full_name) {
      toast.error("Please enter owner name");
      return;
    }

    try {
      await createOwner.mutateAsync({
        full_name: newOwner.full_name,
        email: newOwner.email || null,
        phone: newOwner.phone || null,
        national_id: newOwner.national_id || null,
        address: newOwner.address || null,
        kebele: newOwner.kebele || null,
      });
      toast.success("Land owner added successfully");
      setIsOwnerDialogOpen(false);
      setNewOwner({
        full_name: "",
        email: "",
        phone: "",
        national_id: "",
        address: "",
        kebele: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add owner");
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "registered":
        return "badge-status-active";
      case "pending":
        return "badge-status-pending";
      case "disputed":
        return "badge-status-overdue";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatArea = (area: number) => `${area.toLocaleString()} m²`;
  const formatLandUse = (use: string) => use.charAt(0).toUpperCase() + use.slice(1);

  return (
    <MainLayout
      title="Land Registration"
      subtitle="Manage land parcels and ownership records"
    >
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by parcel ID or owner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Land Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isOwnerDialogOpen} onOpenChange={setIsOwnerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Owner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Land Owner</DialogTitle>
                <DialogDescription>
                  Register a new land owner in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Full Name *</Label>
                  <Input
                    id="ownerName"
                    value={newOwner.full_name}
                    onChange={(e) => setNewOwner({ ...newOwner, full_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newOwner.email}
                      onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newOwner.phone}
                      onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input
                    id="nationalId"
                    value={newOwner.national_id}
                    onChange={(e) => setNewOwner({ ...newOwner, national_id: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newOwner.address}
                    onChange={(e) => setNewOwner({ ...newOwner, address: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOwnerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOwner} disabled={createOwner.isPending}>
                  {createOwner.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Owner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {viewOnly ? "View Land Parcel" : editingParcelId ? "Edit Land Parcel" : "Register New Land Parcel"}
                </DialogTitle>
                <DialogDescription>
                  {viewOnly ? "Details of the selected land parcel." : editingParcelId ? "Update the details for this land parcel." : "Enter the details for the new land parcel."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="owner">Owner *</Label>
                  <Select
                    value={newParcel.owner_id}
                    onValueChange={(value) => setNewParcel({ ...newParcel, owner_id: value })}
                    disabled={viewOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners?.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="area">Area (m²) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={newParcel.area_sqm}
                      onChange={(e) => setNewParcel({ ...newParcel, area_sqm: e.target.value })}
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="landUse">Land Use</Label>
                    <Select
                      value={newParcel.land_use}
                      onValueChange={(value: any) => setNewParcel({ ...newParcel, land_use: value })}
                      disabled={viewOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Label htmlFor="zone">Zone</Label>
                    <Input
                      id="zone"
                      value={newParcel.zone}
                      onChange={(e) => setNewParcel({ ...newParcel, zone: e.target.value })}
                      placeholder="e.g., Zone A"
                      disabled={viewOnly}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kebele">Kebele</Label>
                    <Input
                      id="kebele"
                      value={newParcel.kebele}
                      onChange={(e) => setNewParcel({ ...newParcel, kebele: e.target.value })}
                      disabled={viewOnly}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newParcel.location}
                    onChange={(e) => setNewParcel({ ...newParcel, location: e.target.value })}
                    placeholder="Address or description"
                    disabled={viewOnly}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newParcel.notes}
                    onChange={(e) => setNewParcel({ ...newParcel, notes: e.target.value })}
                    rows={3}
                    disabled={viewOnly}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingParcelId(null);
                  setSearchParams({});
                }}>
                  Cancel
                </Button>
                {!viewOnly && (
                  <Button onClick={handleCreateParcel} disabled={createParcel.isPending || updateParcel.isPending}>
                    {(createParcel.isPending || updateParcel.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingParcelId ? "Update Parcel" : "Register Parcel"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Registration Trends */}
        <RegistrationTrendChart />

        {/* Land Type Distribution */}
        <LandTypeDistributionChart />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredParcels.length} of {parcels?.length || 0} parcels
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredParcels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No land parcels found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        /* Parcels Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParcels.map((parcel, index) => (
            <div
              key={parcel.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {parcel.parcel_id}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatLandUse(parcel.land_use)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn("text-xs capitalize", getStatusBadge(parcel.status))}
                >
                  {parcel.status || "Unknown"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium text-foreground">
                    {parcel.land_owners?.full_name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="text-foreground">{formatArea(parcel.area_sqm)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zone:</span>
                  <span className="text-foreground text-xs">
                    {parcel.zone || parcel.kebele || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="text-foreground">
                    {parcel.registration_date || parcel.created_at?.split("T")[0] || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/land-registration?id=${parcel.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {parcel.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-success border-success/20 hover:bg-success/10"
                    onClick={async () => {
                      try {
                        await updateParcel.mutateAsync({ id: parcel.id, status: "registered" });
                        toast.success("Parcel approved successfully");
                      } catch (e: any) {
                        toast.error(e.message || "Failed to approve");
                      }
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/land-registration?id=${parcel.id}&edit=true`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
