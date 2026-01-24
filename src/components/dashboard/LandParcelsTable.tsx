import { Eye, Edit, MapPin, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLandParcels, useUpdateLandParcel } from "@/hooks/useLandParcels";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LandParcelsTableProps {
  filter?: string;
}

export function LandParcelsTable({ filter = "all" }: LandParcelsTableProps) {
  const { data: parcels, isLoading } = useLandParcels();
  const updateParcel = useUpdateLandParcel();
  const navigate = useNavigate();

  const handleApprove = async (id: string) => {
    try {
      await updateParcel.mutateAsync({ id, status: "registered" });
      toast.success("Parcel approved and set to registered status");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve parcel");
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "registered":
        return "badge-status-active";
      case "pending":
        return "badge-status-pending";
      case "disputed":
        return "badge-status-overdue";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTaxStatusBadge = (assessments: any[]) => {
    // Get latest assessment
    if (!assessments || assessments.length === 0) return "bg-muted text-muted-foreground";

    // Sort by fiscal year desc
    const latest = assessments.sort((a, b) => b.fiscal_year - a.fiscal_year)[0];

    switch (latest.status) {
      case "paid":
        return "badge-status-active";
      case "pending":
        return "badge-status-pending";
      case "overdue":
        return "badge-status-overdue";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTaxStatusText = (assessments: any[]) => {
    if (!assessments || assessments.length === 0) return "Not Assessed";
    const latest = assessments.sort((a, b) => b.fiscal_year - a.fiscal_year)[0];
    return latest.status ? latest.status.charAt(0).toUpperCase() + latest.status.slice(1) : "Unknown";
  };

  const formatLandUse = (use: string) => {
    return use ? use.charAt(0).toUpperCase() + use.slice(1) : "Unknown";
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} m²`;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter parcels based on the status if filter is not "all"
  const filteredParcels = parcels?.filter(p => filter === "all" || p.status === filter) || [];

  // Take only the first 5 items for the dashboard view
  const recentParcels = filteredParcels.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Land Parcels</h3>
          <Button variant="outline" size="sm" onClick={() => navigate("/land-registration")}>
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-5 py-3 text-left">Parcel ID</th>
              <th className="px-5 py-3 text-left">Owner</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Size</th>
              <th className="px-5 py-3 text-left">Zone</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Tax</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentParcels.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted-foreground">
                  No land parcels registered yet
                </td>
              </tr>
            ) : (
              recentParcels.map((parcel, index) => (
                <tr
                  key={parcel.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">
                        {parcel.parcel_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">
                    {parcel.land_owners?.full_name || "Unknown"}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {formatLandUse(parcel.land_use)}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {formatArea(parcel.area_sqm)}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {parcel.zone || parcel.kebele || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs capitalize",
                        getStatusBadge(parcel.status)
                      )}
                    >
                      {parcel.status || "Unknown"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        getTaxStatusBadge(parcel.tax_assessments as any[])
                      )}
                    >
                      {getTaxStatusText(parcel.tax_assessments as any[])}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {parcel.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleApprove(parcel.id)}
                          title="Approve / Make Active"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => navigate(`/land-registration?id=${parcel.id}`)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gold hover:text-gold hover:bg-gold/10"
                        onClick={() => navigate(`/land-registration?id=${parcel.id}&edit=true`)}
                        title="Edit Parcel"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
