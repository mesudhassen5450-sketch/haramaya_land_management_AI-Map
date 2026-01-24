import { useState } from "react";
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
    Building2,
    Home,
    Building,
    School,
    CheckCircle,
    XCircle,
    Eye,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useStructures,
    useCreateStructure,
    useVerifyStructure,
    type StructureType,
} from "@/hooks/useStructures";
import { useLandParcels } from "@/hooks/useLandParcels";
import { StructureImageUpload } from "@/components/StructureImageUpload";
import { StructureGallery } from "@/components/StructureGallery";
import { ComplianceStatusBadge } from "@/components/ComplianceStatusBadge";
import { toast } from "sonner";

const structureTypeOptions: { value: StructureType; label: string; icon: any }[] = [
    { value: "residential_house", label: "Residential House", icon: Home },
    { value: "commercial_building", label: "Commercial Building", icon: Building2 },
    { value: "apartment", label: "Apartment/Condominium", icon: Building },
    { value: "institutional", label: "Institutional Building", icon: School },
    { value: "government_approved", label: "Government Approved", icon: CheckCircle },
];

export default function StructureRegistry() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewStructure, setViewStructure] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        parcel_id: "",
        structure_type: "residential_house" as StructureType,
        structure_name: "",
        building_permit_number: "",
        occupancy_certificate_number: "",
        construction_year: "",
        floor_count: "1",
        structure_images: [] as string[],
        notes: "",
    });

    const { data: structures, isLoading } = useStructures();
    const { data: parcels } = useLandParcels();
    const createStructure = useCreateStructure();
    const verifyStructure = useVerifyStructure();

    const filteredStructures = structures?.filter((structure) => {
        const matchesSearch =
            structure.structure_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            structure.building_permit_number?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || structure.verification_status === statusFilter;
        const matchesType = typeFilter === "all" || structure.structure_type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    }) || [];

    const handleCreateStructure = async () => {
        if (!formData.parcel_id || !formData.structure_name) {
            toast.error("Please fill in required fields");
            return;
        }

        if (formData.structure_images.length === 0) {
            toast.error("Please upload at least one image of the structure");
            return;
        }

        try {
            await createStructure.mutateAsync({
                parcel_id: formData.parcel_id,
                structure_type: formData.structure_type,
                structure_name: formData.structure_name,
                building_permit_number: formData.building_permit_number || undefined,
                occupancy_certificate_number: formData.occupancy_certificate_number || undefined,
                construction_year: formData.construction_year ? parseInt(formData.construction_year) : undefined,
                floor_count: parseInt(formData.floor_count),
                structure_images: formData.structure_images,
                notes: formData.notes || undefined,
            });

            setIsDialogOpen(false);
            setFormData({
                parcel_id: "",
                structure_type: "residential_house",
                structure_name: "",
                building_permit_number: "",
                occupancy_certificate_number: "",
                construction_year: "",
                floor_count: "1",
                structure_images: [],
                notes: "",
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to register structure");
        }
    };

    const handleVerify = async (id: string, status: "verified" | "rejected", reason?: string) => {
        try {
            await verifyStructure.mutateAsync({
                id,
                status,
                rejectionReason: reason,
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to verify structure");
        }
    };

    const getStructureIcon = (type: StructureType) => {
        const option = structureTypeOptions.find((opt) => opt.value === type);
        return option?.icon || Building2;
    };

    const getStructureLabel = (type: StructureType) => {
        const option = structureTypeOptions.find((opt) => opt.value === type);
        return option?.label || type;
    };

    return (
        <MainLayout
            title="Structure Registry"
            subtitle="Register and verify permanent structures on land parcels"
        >
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by structure name or permit number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-48">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {structureTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Register Structure
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Register New Structure</DialogTitle>
                                <DialogDescription>
                                    Register a permanent structure on a land parcel to enable sale eligibility
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="parcel">Land Parcel *</Label>
                                    <Select
                                        value={formData.parcel_id}
                                        onValueChange={(value) => setFormData({ ...formData, parcel_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select land parcel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parcels?.map((parcel) => (
                                                <SelectItem key={parcel.id} value={parcel.id}>
                                                    {parcel.parcel_id} - {parcel.land_owners?.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="structureType">Structure Type *</Label>
                                        <Select
                                            value={formData.structure_type}
                                            onValueChange={(value: StructureType) =>
                                                setFormData({ ...formData, structure_type: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {structureTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="structureName">Structure Name *</Label>
                                        <Input
                                            id="structureName"
                                            value={formData.structure_name}
                                            onChange={(e) => setFormData({ ...formData, structure_name: e.target.value })}
                                            placeholder="e.g., Main Residence"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="permitNumber">Building Permit Number</Label>
                                        <Input
                                            id="permitNumber"
                                            value={formData.building_permit_number}
                                            onChange={(e) =>
                                                setFormData({ ...formData, building_permit_number: e.target.value })
                                            }
                                            placeholder="BP-2024-001"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="certificateNumber">Occupancy Certificate</Label>
                                        <Input
                                            id="certificateNumber"
                                            value={formData.occupancy_certificate_number}
                                            onChange={(e) =>
                                                setFormData({ ...formData, occupancy_certificate_number: e.target.value })
                                            }
                                            placeholder="OC-2024-001"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="constructionYear">Construction Year</Label>
                                        <Input
                                            id="constructionYear"
                                            type="number"
                                            value={formData.construction_year}
                                            onChange={(e) =>
                                                setFormData({ ...formData, construction_year: e.target.value })
                                            }
                                            placeholder="2024"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="floorCount">Number of Floors</Label>
                                        <Input
                                            id="floorCount"
                                            type="number"
                                            value={formData.floor_count}
                                            onChange={(e) => setFormData({ ...formData, floor_count: e.target.value })}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Structure Images * (Required for verification)</Label>
                                    <StructureImageUpload
                                        images={formData.structure_images}
                                        onChange={(images) => setFormData({ ...formData, structure_images: images })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={3}
                                        placeholder="Any additional information about the structure..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateStructure} disabled={createStructure.isPending}>
                                    {createStructure.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Register Structure
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredStructures.length} of {structures?.length || 0} structures
                </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-96 rounded-xl" />
                    ))}
                </div>
            ) : filteredStructures.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No structures found</p>
                    <p className="text-sm">Register a structure to enable land sales</p>
                </div>
            ) : (
                /* Structures Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStructures.map((structure, index) => {
                        const StructureIcon = getStructureIcon(structure.structure_type);
                        return (
                            <div
                                key={structure.id}
                                className="bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <StructureIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground text-sm">
                                                {structure.structure_name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {getStructureLabel(structure.structure_type)}
                                            </p>
                                        </div>
                                    </div>
                                    <ComplianceStatusBadge status={structure.verification_status} />
                                </div>

                                {/* Image Preview */}
                                {structure.structure_images.length > 0 && (
                                    <div className="mb-3 rounded-lg overflow-hidden">
                                        <img
                                            src={structure.structure_images[0]}
                                            alt={structure.structure_name}
                                            className="w-full h-40 object-cover"
                                        />
                                        {structure.structure_images.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                +{structure.structure_images.length - 1} more
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    {structure.building_permit_number && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Permit:</span>
                                            <span className="font-medium text-foreground">
                                                {structure.building_permit_number}
                                            </span>
                                        </div>
                                    )}
                                    {structure.construction_year && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Built:</span>
                                            <span className="text-foreground">{structure.construction_year}</span>
                                        </div>
                                    )}
                                    {structure.floor_count && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Floors:</span>
                                            <span className="text-foreground">{structure.floor_count}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setViewStructure(structure)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                    {structure.verification_status === "pending" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-green-600 border-green-500/20 hover:bg-green-500/10"
                                                onClick={() => handleVerify(structure.id, "verified")}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Verify
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-red-600 border-red-500/20 hover:bg-red-500/10"
                                                onClick={() => {
                                                    const reason = prompt("Rejection reason:");
                                                    if (reason) handleVerify(structure.id, "rejected", reason);
                                                }}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Structure Dialog */}
            <Dialog open={!!viewStructure} onOpenChange={() => setViewStructure(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewStructure?.structure_name}</DialogTitle>
                        <DialogDescription>
                            {getStructureLabel(viewStructure?.structure_type)}
                        </DialogDescription>
                    </DialogHeader>
                    {viewStructure && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ComplianceStatusBadge
                                    status={viewStructure.verification_status}
                                    reason={viewStructure.rejection_reason}
                                />
                            </div>

                            {/* Image Gallery */}
                            {viewStructure.structure_images.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Structure Images</h4>
                                    <StructureGallery
                                        images={viewStructure.structure_images}
                                        title={viewStructure.structure_name}
                                    />
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {viewStructure.building_permit_number && (
                                    <div>
                                        <Label>Building Permit Number</Label>
                                        <p className="text-sm">{viewStructure.building_permit_number}</p>
                                    </div>
                                )}
                                {viewStructure.occupancy_certificate_number && (
                                    <div>
                                        <Label>Occupancy Certificate</Label>
                                        <p className="text-sm">{viewStructure.occupancy_certificate_number}</p>
                                    </div>
                                )}
                                {viewStructure.construction_year && (
                                    <div>
                                        <Label>Construction Year</Label>
                                        <p className="text-sm">{viewStructure.construction_year}</p>
                                    </div>
                                )}
                                {viewStructure.floor_count && (
                                    <div>
                                        <Label>Number of Floors</Label>
                                        <p className="text-sm">{viewStructure.floor_count}</p>
                                    </div>
                                )}
                            </div>

                            {viewStructure.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm text-muted-foreground">{viewStructure.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
