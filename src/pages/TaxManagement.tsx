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
import {
  Search,
  Filter,
  Download,
  Receipt,
  Calculator,
  Send,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useTaxAssessments, useTaxRates, useCreateTaxAssessment } from "@/hooks/useTaxAssessments";
import { useLandParcels } from "@/hooks/useLandParcels";
import { usePropertyValuations } from "@/hooks/usePropertyValuations";
import { TaxRevenueTrendChart } from "@/components/charts/TaxRevenueTrendChart";
import { TaxStatusChart } from "@/components/charts/TaxStatusChart";
import { toast } from "sonner";

export default function TaxManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    parcel_id: "",
    valuation_id: "",
    fiscal_year: new Date().getFullYear().toString(),
    due_date: "",
  });

  const { data: taxAssessments, isLoading } = useTaxAssessments();
  const { data: taxRates } = useTaxRates();
  const { data: parcels } = useLandParcels();
  const { data: valuations } = usePropertyValuations();
  const createAssessment = useCreateTaxAssessment();

  // Calculate stats
  const currentYear = new Date().getFullYear();
  const currentYearTaxes = taxAssessments?.filter((t) => t.fiscal_year === currentYear) || [];
  const totalAssessed = currentYearTaxes.reduce((sum, t) => sum + Number(t.total_due), 0);
  const paidTaxes = currentYearTaxes.filter((t) => t.status === "paid");
  const totalCollected = paidTaxes.reduce((sum, t) => sum + Number(t.total_due), 0);
  const pendingCount = currentYearTaxes.filter((t) => t.status === "pending").length;
  const overdueCount = currentYearTaxes.filter((t) => t.status === "overdue").length;
  const pendingAmount = currentYearTaxes
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + Number(t.total_due), 0);
  const overdueAmount = currentYearTaxes
    .filter((t) => t.status === "overdue")
    .reduce((sum, t) => sum + Number(t.total_due), 0);

  const filteredTaxes = taxAssessments?.filter((tax) => {
    const parcel = tax.land_parcels;
    const matchesSearch =
      tax.tax_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel?.parcel_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel?.land_owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tax.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateAssessment = async () => {
    if (!newAssessment.parcel_id || !newAssessment.due_date) {
      toast.error("Please fill in required fields");
      return;
    }

    // Get parcel and valuation info
    const parcel = parcels?.find((p) => p.id === newAssessment.parcel_id);
    const valuation = valuations?.find((v) => v.parcel_id === newAssessment.parcel_id && v.is_current);
    const rate = taxRates?.find((r) => r.land_use === parcel?.land_use);

    if (!valuation) {
      toast.error("No current valuation found for this parcel");
      return;
    }

    const assessedValue = Number(valuation.assessed_value);
    const taxRate = rate?.rate || 0.01;
    const taxAmount = assessedValue * Number(taxRate);

    try {
      await createAssessment.mutateAsync({
        parcel_id: newAssessment.parcel_id,
        valuation_id: valuation.id,
        fiscal_year: parseInt(newAssessment.fiscal_year),
        due_date: newAssessment.due_date,
        assessed_value: assessedValue,
        tax_rate: Number(taxRate),
        tax_amount: taxAmount,
        total_due: taxAmount,
      });
      toast.success("Tax assessment created successfully");
      setIsDialogOpen(false);
      setNewAssessment({
        parcel_id: "",
        valuation_id: "",
        fiscal_year: new Date().getFullYear().toString(),
        due_date: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create assessment");
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(1)}K`;
    return `ETB ${amount.toFixed(0)}`;
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "paid":
        return "badge-status-active";
      case "pending":
        return "badge-status-pending";
      case "overdue":
        return "badge-status-overdue";
      case "partial":
        return "badge-status-pending";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout
      title="Tax Management"
      subtitle="Property tax assessments and collection"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Assessed"
              value={formatCurrency(totalAssessed)}
              change={`Fiscal year ${currentYear}`}
              changeType="neutral"
              icon={Calculator}
              variant="primary"
            />
            <StatCard
              title="Collected"
              value={formatCurrency(totalCollected)}
              change={`${totalAssessed > 0 ? ((totalCollected / totalAssessed) * 100).toFixed(0) : 0}% collection rate`}
              changeType="positive"
              icon={CreditCard}
              variant="success"
            />
            <StatCard
              title="Pending"
              value={formatCurrency(pendingAmount)}
              change={`${pendingCount} accounts`}
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Overdue"
              value={formatCurrency(overdueAmount)}
              change={`${overdueCount} accounts`}
              changeType="negative"
              icon={AlertCircle}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trends */}
        <TaxRevenueTrendChart />

        {/* Status Distribution */}
        <TaxStatusChart />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by tax ID, parcel, or owner..."
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Receipt className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Tax Assessment</DialogTitle>
                <DialogDescription>
                  Generate a new tax assessment for a property.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Parcel *</Label>
                  <Select
                    value={newAssessment.parcel_id}
                    onValueChange={(value) => setNewAssessment({ ...newAssessment, parcel_id: value })}
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
                    <Label>Fiscal Year</Label>
                    <Input
                      type="number"
                      value={newAssessment.fiscal_year}
                      onChange={(e) => setNewAssessment({ ...newAssessment, fiscal_year: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="date"
                      value={newAssessment.due_date}
                      onChange={(e) => setNewAssessment({ ...newAssessment, due_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssessment} disabled={createAssessment.isPending}>
                  {createAssessment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Assessment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tax Records Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Tax ID</th>
                  <th className="px-5 py-3 text-left">Parcel</th>
                  <th className="px-5 py-3 text-left">Owner</th>
                  <th className="px-5 py-3 text-left">Land Type</th>
                  <th className="px-5 py-3 text-left">Assessed Value</th>
                  <th className="px-5 py-3 text-left">Tax Amount</th>
                  <th className="px-5 py-3 text-left">Due Date</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTaxes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                      No tax assessments found
                    </td>
                  </tr>
                ) : (
                  filteredTaxes.map((record, index) => (
                    <tr
                      key={record.id}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                      )}
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-foreground text-sm">
                          {record.tax_id}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-primary font-medium">
                        {record.land_parcels?.parcel_id || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {record.land_parcels?.land_owners?.full_name || "Unknown"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground capitalize">
                        {record.land_parcels?.land_use || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {formatCurrency(Number(record.assessed_value))}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {formatCurrency(Number(record.total_due))}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {record.due_date}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="secondary"
                          className={cn("text-xs capitalize", getStatusBadge(record.status))}
                        >
                          {record.status === "paid" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {record.status === "overdue" && (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          {record.status !== "paid" && (
                            <Button variant="outline" size="sm">
                              <Send className="w-4 h-4 mr-1" />
                              Remind
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
