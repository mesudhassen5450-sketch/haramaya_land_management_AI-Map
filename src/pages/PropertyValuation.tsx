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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Calculator,
  TrendingUp,
  Building,
  Landmark,
  Trees,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePropertyValuations, useValuationStats, useCreateValuation } from "@/hooks/usePropertyValuations";
import { useLandParcels } from "@/hooks/useLandParcels";
import { ValuationTrendsChart } from "@/components/charts/ValuationTrendsChart";
import { ValuationDistributionChart } from "@/components/charts/ValuationDistributionChart";
import { toast } from "sonner";

const valuationFactors = [
  { factor: "Location Premium", zone: "Zone A", multiplier: "1.5x" },
  { factor: "Infrastructure Access", condition: "Full Access", multiplier: "1.2x" },
  { factor: "Road Frontage", type: "Main Road", multiplier: "1.15x" },
  { factor: "Land Grade", grade: "Grade 1", multiplier: "1.1x" },
];

export default function PropertyValuation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newValuation, setNewValuation] = useState({
    parcel_id: "",
    assessed_value: "",
    market_value: "",
    valuation_method: "standard",
    location_factor: "1.0",
    infrastructure_score: "5",
    notes: "",
  });

  const { data: valuations, isLoading } = usePropertyValuations();
  const { data: stats, isLoading: statsLoading } = useValuationStats();
  const { data: parcels } = useLandParcels();
  const createValuation = useCreateValuation();

  const filteredValuations = valuations?.filter((v) => {
    const parcel = v.land_parcels;
    const matchesSearch =
      parcel?.parcel_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel?.land_owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const approved = !!v.approved_at;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && approved) ||
      (statusFilter === "pending" && !approved);
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateValuation = async () => {
    if (!newValuation.parcel_id || !newValuation.assessed_value) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createValuation.mutateAsync({
        parcel_id: newValuation.parcel_id,
        assessed_value: parseFloat(newValuation.assessed_value),
        market_value: newValuation.market_value ? parseFloat(newValuation.market_value) : null,
        valuation_method: newValuation.valuation_method,
        location_factor: parseFloat(newValuation.location_factor),
        infrastructure_score: parseInt(newValuation.infrastructure_score),
        notes: newValuation.notes || null,
      });
      toast.success("Valuation created successfully");
      setIsDialogOpen(false);
      setNewValuation({
        parcel_id: "",
        assessed_value: "",
        market_value: "",
        valuation_method: "standard",
        location_factor: "1.0",
        infrastructure_score: "5",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create valuation");
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `ETB ${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(1)}K`;
    return `ETB ${amount.toFixed(0)}`;
  };

  // Group valuations by land use
  const byLandUse = valuations?.reduce((acc, v) => {
    const use = v.land_parcels?.land_use || "other";
    if (!acc[use]) acc[use] = { count: 0, value: 0 };
    acc[use].count += 1;
    acc[use].value += Number(v.assessed_value);
    return acc;
  }, {} as Record<string, { count: number; value: number }>) || {};

  return (
    <MainLayout
      title="Property Valuation"
      subtitle="Automated property assessment and valuation management"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Properties Valued"
              value={stats?.totalValuations || 0}
              change="Current valuations"
              changeType="neutral"
              icon={Calculator}
              variant="primary"
            />
            <StatCard
              title="Total Assessed Value"
              value={formatCurrency(stats?.totalAssessedValue || 0)}
              change="Current records"
              changeType="positive"
              icon={TrendingUp}
              variant="gold"
            />
            <StatCard
              title="Pending Approval"
              value={stats?.pendingApproval || 0}
              change="Awaiting review"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Approved"
              value={stats?.approved || 0}
              change="Finalized valuations"
              changeType="positive"
              icon={CheckCircle}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Valuation Trends */}
        <ValuationTrendsChart />

        {/* Land Type Distribution */}
        <ValuationDistributionChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Valuation Factors Card - Moved to bottom row */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Valuation Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {valuationFactors.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.factor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.zone || item.condition || item.type || item.grade}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {item.multiplier}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by parcel ID or owner..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="w-4 h-4 mr-2" />
                New Valuation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Valuation</DialogTitle>
                <DialogDescription>
                  Enter valuation details for a property.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Parcel *</Label>
                  <Select
                    value={newValuation.parcel_id}
                    onValueChange={(value) => setNewValuation({ ...newValuation, parcel_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parcel" />
                    </SelectTrigger>
                    <SelectContent>
                      {parcels?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.parcel_id} - {p.land_owners?.full_name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Assessed Value (ETB) *</Label>
                    <Input
                      type="number"
                      value={newValuation.assessed_value}
                      onChange={(e) => setNewValuation({ ...newValuation, assessed_value: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Market Value (ETB)</Label>
                    <Input
                      type="number"
                      value={newValuation.market_value}
                      onChange={(e) => setNewValuation({ ...newValuation, market_value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Location Factor</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newValuation.location_factor}
                      onChange={(e) => setNewValuation({ ...newValuation, location_factor: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Infrastructure Score (0-10)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={newValuation.infrastructure_score}
                      onChange={(e) => setNewValuation({ ...newValuation, infrastructure_score: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateValuation} disabled={createValuation.isPending}>
                  {createValuation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Valuation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Valuation Records Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Parcel ID</th>
                  <th className="px-5 py-3 text-left">Owner</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Size</th>
                  <th className="px-5 py-3 text-left">Assessed Value</th>
                  <th className="px-5 py-3 text-left">Market Value</th>
                  <th className="px-5 py-3 text-left">Method</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredValuations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                      No valuations found
                    </td>
                  </tr>
                ) : (
                  filteredValuations.map((record, index) => {
                    const approved = !!record.approved_at;
                    return (
                      <tr
                        key={record.id}
                        className={cn(
                          "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                          index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                        )}
                      >
                        <td className="px-5 py-4 text-sm text-primary font-medium">
                          {record.land_parcels?.parcel_id || "N/A"}
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground">
                          {record.land_parcels?.land_owners?.full_name || "Unknown"}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground capitalize">
                          {record.land_parcels?.land_use || "N/A"}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {record.land_parcels?.area_sqm?.toLocaleString() || 0} m²
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-foreground">
                          {formatCurrency(Number(record.assessed_value))}
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground">
                          {record.market_value ? formatCurrency(Number(record.market_value)) : "N/A"}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground capitalize">
                          {record.valuation_method || "Standard"}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              approved ? "badge-status-active" : "badge-status-pending"
                            )}
                          >
                            {approved ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {approved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
