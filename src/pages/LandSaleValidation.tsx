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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Eye,
    FileText,
    Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCheckSaleEligibility, useComplianceReport } from "@/hooks/useStructures";
import { StructureGallery } from "@/components/StructureGallery";
import { ComplianceStatusBadge } from "@/components/ComplianceStatusBadge";
import { toast } from "sonner";

export default function LandSaleValidation() {
    const [searchQuery, setSearchQuery] = useState("");
    const [complianceFilter, setComplianceFilter] = useState("all");
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [viewReport, setViewReport] = useState<string | null>(null);

    // Fetch property sales with parcel and structure information
    const { data: sales, isLoading } = useQuery({
        queryKey: ["property_sales_validation"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("property_sales")
                .select(`
          *,
          land_parcels (
            id,
            parcel_id,
            land_use,
            area_sqm,
            location,
            land_owners (
              full_name,
              phone,
              email
            )
          ),
          land_structures (
            id,
            structure_name,
            structure_type,
            structure_images,
            verification_status,
            building_permit_number
          )
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const filteredSales = sales?.filter((sale) => {
        const matchesSearch =
            sale.land_parcels?.parcel_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.land_parcels?.land_owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCompliance =
            complianceFilter === "all" || sale.compliance_status === complianceFilter;
        return matchesSearch && matchesCompliance;
    }) || [];

    // Get compliance statistics
    const stats = {
        total: sales?.length || 0,
        compliant: sales?.filter((s) => s.compliance_status === "compliant").length || 0,
        nonCompliant: sales?.filter((s) => s.compliance_status === "non_compliant").length || 0,
        underReview: sales?.filter((s) => s.compliance_status === "under_review").length || 0,
    };

    const handleApproveSale = async (saleId: string) => {
        try {
            const { error } = await supabase
                .from("property_sales")
                .update({
                    status: "approved",
                    compliance_status: "compliant",
                })
                .eq("id", saleId);

            if (error) throw error;
            toast.success("Sale approved successfully");
            setSelectedSale(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to approve sale");
        }
    };

    const handleRejectSale = async (saleId: string, reason: string) => {
        try {
            const { error } = await supabase
                .from("property_sales")
                .update({
                    status: "cancelled",
                    compliance_status: "non_compliant",
                    rejection_reason: reason,
                })
                .eq("id", saleId);

            if (error) throw error;
            toast.success("Sale rejected");
            setSelectedSale(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to reject sale");
        }
    };

    return (
        <MainLayout
            title="Land Sale Validation"
            subtitle="Validate land sales against Ethiopian law requirements"
        >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Sales</p>
                            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Compliant</p>
                            <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Non-Compliant</p>
                            <p className="text-2xl font-bold text-red-600">{stats.nonCompliant}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Under Review</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

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
                <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                    <SelectTrigger className="w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Compliance Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredSales.length} of {sales?.length || 0} sales
                </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
                    ))}
                </div>
            ) : filteredSales.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No sales found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                </div>
            ) : (
                /* Sales Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSales.map((sale, index) => (
                        <div
                            key={sale.id}
                            className={cn(
                                "bg-card border rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up",
                                sale.compliance_status === "non_compliant" && "border-red-500/30",
                                sale.compliance_status === "compliant" && "border-green-500/30"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {sale.land_parcels?.parcel_id || "Unknown Parcel"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {sale.land_parcels?.land_owners?.full_name || "Unknown Owner"}
                                    </p>
                                </div>
                                <ComplianceStatusBadge
                                    status={sale.compliance_status || "under_review"}
                                    reason={sale.rejection_reason}
                                />
                            </div>

                            {/* Structure Preview */}
                            {sale.land_structures && sale.land_structures.length > 0 ? (
                                <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">
                                            {sale.land_structures.length} Structure(s) Registered
                                        </span>
                                    </div>
                                    {sale.land_structures[0].structure_images?.length > 0 && (
                                        <div className="rounded-lg overflow-hidden">
                                            <img
                                                src={sale.land_structures[0].structure_images[0]}
                                                alt="Structure"
                                                className="w-full h-32 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-600">
                                            No Permanent Structure
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-600/80 mt-1">
                                        Sale not permitted under Ethiopian law
                                    </p>
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Land Use:</span>
                                    <span className="text-foreground capitalize">
                                        {sale.land_parcels?.land_use || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Area:</span>
                                    <span className="text-foreground">
                                        {sale.land_parcels?.area_sqm?.toLocaleString() || "N/A"} m²
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="text-foreground font-medium">
                                        {sale.price ? `ETB ${sale.price.toLocaleString()}` : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-border">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setSelectedSale(sale)}
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Review
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setViewReport(sale.land_parcels?.id)}
                                >
                                    <FileText className="w-4 h-4 mr-1" />
                                    Report
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Dialog */}
            <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Sale Validation Review</DialogTitle>
                        <DialogDescription>
                            Review land sale compliance with Ethiopian law
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSale && (
                        <div className="space-y-4">
                            {/* Compliance Status */}
                            <div className="flex items-center gap-2">
                                <ComplianceStatusBadge
                                    status={selectedSale.compliance_status || "under_review"}
                                    reason={selectedSale.rejection_reason}
                                />
                            </div>

                            {/* Parcel Information */}
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h4 className="font-medium mb-2">Parcel Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Parcel ID</Label>
                                        <p className="text-sm">{selectedSale.land_parcels?.parcel_id}</p>
                                    </div>
                                    <div>
                                        <Label>Owner</Label>
                                        <p className="text-sm">{selectedSale.land_parcels?.land_owners?.full_name}</p>
                                    </div>
                                    <div>
                                        <Label>Land Use</Label>
                                        <p className="text-sm capitalize">{selectedSale.land_parcels?.land_use}</p>
                                    </div>
                                    <div>
                                        <Label>Area</Label>
                                        <p className="text-sm">{selectedSale.land_parcels?.area_sqm?.toLocaleString()} m²</p>
                                    </div>
                                </div>
                            </div>

                            {/* Structure Information */}
                            {selectedSale.land_structures && selectedSale.land_structures.length > 0 ? (
                                <div>
                                    <h4 className="font-medium mb-2">Registered Structures</h4>
                                    {selectedSale.land_structures.map((structure: any) => (
                                        <div key={structure.id} className="bg-muted/50 rounded-lg p-4 mb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium">{structure.structure_name}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {structure.structure_type?.replace("_", " ")}
                                                    </p>
                                                </div>
                                                <ComplianceStatusBadge status={structure.verification_status} />
                                            </div>
                                            {structure.building_permit_number && (
                                                <p className="text-sm">
                                                    <span className="text-muted-foreground">Permit: </span>
                                                    {structure.building_permit_number}
                                                </p>
                                            )}
                                            {structure.structure_images?.length > 0 && (
                                                <div className="mt-3">
                                                    <StructureGallery
                                                        images={structure.structure_images}
                                                        title={structure.structure_name}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                        <h4 className="font-medium text-red-600">No Permanent Structure</h4>
                                    </div>
                                    <p className="text-sm text-red-600/80">
                                        This land parcel does not have any registered permanent structures. Under
                                        Ethiopian law, only land with residential houses, commercial buildings,
                                        apartments, or institutional buildings can be sold.
                                    </p>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {selectedSale.rejection_reason && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <Label>Rejection Reason</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedSale.rejection_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedSale(null)}>
                            Close
                        </Button>
                        {selectedSale?.compliance_status !== "compliant" &&
                            selectedSale?.land_structures?.length > 0 &&
                            selectedSale?.land_structures.some((s: any) => s.verification_status === "verified") && (
                                <Button
                                    onClick={() => handleApproveSale(selectedSale.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Sale
                                </Button>
                            )}
                        {selectedSale?.compliance_status !== "non_compliant" && (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    const reason = prompt("Enter rejection reason:");
                                    if (reason) handleRejectSale(selectedSale.id, reason);
                                }}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Sale
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Compliance Report Dialog */}
            <ComplianceReportDialog parcelId={viewReport} onClose={() => setViewReport(null)} />
        </MainLayout>
    );
}

// Compliance Report Component
function ComplianceReportDialog({ parcelId, onClose }: { parcelId: string | null; onClose: () => void }) {
    const { data: report } = useComplianceReport(parcelId);

    return (
        <Dialog open={!!parcelId} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Compliance Report</DialogTitle>
                    <DialogDescription>
                        Detailed compliance analysis for land parcel
                    </DialogDescription>
                </DialogHeader>
                {report && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Parcel ID</Label>
                                <p className="text-sm font-medium">{report.parcel_id}</p>
                            </div>
                            <div>
                                <Label>Owner</Label>
                                <p className="text-sm">{report.owner_name}</p>
                            </div>
                            <div>
                                <Label>Land Use</Label>
                                <p className="text-sm capitalize">{report.land_use}</p>
                            </div>
                            <div>
                                <Label>Area</Label>
                                <p className="text-sm">{report.area_sqm?.toLocaleString()} m²</p>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium mb-3">Structure Analysis</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Total Structures</Label>
                                    <p className="text-2xl font-bold">{report.structure_count}</p>
                                </div>
                                <div>
                                    <Label>Verified</Label>
                                    <p className="text-2xl font-bold text-green-600">{report.verified_structures}</p>
                                </div>
                                <div>
                                    <Label>Pending</Label>
                                    <p className="text-2xl font-bold text-yellow-600">{report.pending_structures}</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "rounded-lg p-4 border-2",
                            report.sale_eligible
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-red-500/10 border-red-500/30"
                        )}>
                            <div className="flex items-center gap-2 mb-2">
                                {report.sale_eligible ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <h4 className={cn(
                                    "font-medium",
                                    report.sale_eligible ? "text-green-600" : "text-red-600"
                                )}>
                                    {report.sale_eligible ? "ELIGIBLE FOR SALE" : "NOT ELIGIBLE FOR SALE"}
                                </h4>
                            </div>
                            <p className="text-sm">{report.compliance_notes}</p>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
