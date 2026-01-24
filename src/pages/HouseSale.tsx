import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Home,
  DollarSign,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePropertySalesManagement, useSaleStats, useCreatePropertySaleManagement, useApproveSale, useCompleteSale } from "@/hooks/usePropertySalesManagement";
import { useLandParcels, useLandOwners } from "@/hooks/useLandParcels";
import { toast } from "sonner";

export default function HouseSales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    parcel_id: "",
    seller_id: "",
    buyer_name: "",
    buyer_national_id: "",
    buyer_phone: "",
    buyer_email: "",
    sale_price: "",
    sale_date: new Date().toISOString().split("T")[0],
    title_transfer_fee: "",
    stamp_duty: "",
    notes: "",
  });

  const { data: sales, isLoading } = usePropertySalesManagement("house");
  const { data: stats, isLoading: statsLoading } = useSaleStats();
  const { data: parcels } = useLandParcels();
  const { data: owners } = useLandOwners();
  const createSale = useCreatePropertySaleManagement();
  const approveSale = useApproveSale();
  const completeSale = useCompleteSale();

  const filteredSales = sales?.filter((sale) => {
    const matchesSearch =
      sale.sale_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.land_parcels?.parcel_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateSale = async () => {
    if (!newSale.buyer_name || !newSale.sale_price) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createSale.mutateAsync({
        property_type: "house",
        parcel_id: newSale.parcel_id || undefined,
        seller_id: newSale.seller_id || undefined,
        buyer_name: newSale.buyer_name,
        buyer_national_id: newSale.buyer_national_id || undefined,
        buyer_phone: newSale.buyer_phone || undefined,
        buyer_email: newSale.buyer_email || undefined,
        sale_price: parseFloat(newSale.sale_price),
        sale_date: newSale.sale_date || undefined,
        title_transfer_fee: newSale.title_transfer_fee ? parseFloat(newSale.title_transfer_fee) : undefined,
        stamp_duty: newSale.stamp_duty ? parseFloat(newSale.stamp_duty) : undefined,
        notes: newSale.notes || undefined,
      });
      toast.success("House sale registered successfully");
      setIsDialogOpen(false);
      setNewSale({
        parcel_id: "",
        seller_id: "",
        buyer_name: "",
        buyer_national_id: "",
        buyer_phone: "",
        buyer_email: "",
        sale_price: "",
        sale_date: new Date().toISOString().split("T")[0],
        title_transfer_fee: "",
        stamp_duty: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register sale");
    }
  };

  const handleApprove = async (saleId: string) => {
    try {
      await approveSale.mutateAsync(saleId);
      toast.success("Sale approved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve sale");
    }
  };

  const handleComplete = async (saleId: string) => {
    try {
      await completeSale.mutateAsync(saleId);
      toast.success("Sale completed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete sale");
    }
  };

  const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return "badge-status-active";
      case "approved":
        return "badge-status-pending";
      case "pending":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "badge-status-overdue";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout
      title="House Property Sales"
      subtitle="Manage house property sales and transfers"
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
              title="Total House Sales"
              value={stats?.houseSales || 0}
              change="All time"
              changeType="neutral"
              icon={Home}
              variant="primary"
            />
            <StatCard
              title="Total Value"
              value={formatCurrency(stats?.totalValue || 0)}
              change="All transactions"
              changeType="positive"
              icon={DollarSign}
              variant="gold"
            />
            <StatCard
              title="Pending"
              value={stats?.pendingSales || 0}
              change="Awaiting approval"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Completed"
              value={stats?.completedSales || 0}
              change="Finalized"
              changeType="positive"
              icon={CheckCircle}
            />
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by sale ID, buyer, or property..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register House Sale</DialogTitle>
                <DialogDescription>
                  Enter the details for the house property sale.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Associated Land Parcel</Label>
                    <Select
                      value={newSale.parcel_id}
                      onValueChange={(value) => setNewSale({ ...newSale, parcel_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parcel (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {parcels?.filter(p => p.land_use === "residential").map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.parcel_id} - {p.land_owners?.full_name || "Unknown"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Seller</Label>
                    <Select
                      value={newSale.seller_id}
                      onValueChange={(value) => setNewSale({ ...newSale, seller_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select seller" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners?.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Buyer Name *</Label>
                  <Input
                    value={newSale.buyer_name}
                    onChange={(e) => setNewSale({ ...newSale, buyer_name: e.target.value })}
                    placeholder="Full name of the buyer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Buyer National ID</Label>
                    <Input
                      value={newSale.buyer_national_id}
                      onChange={(e) => setNewSale({ ...newSale, buyer_national_id: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Buyer Phone</Label>
                    <Input
                      value={newSale.buyer_phone}
                      onChange={(e) => setNewSale({ ...newSale, buyer_phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Sale Price (ETB) *</Label>
                    <Input
                      type="number"
                      value={newSale.sale_price}
                      onChange={(e) => setNewSale({ ...newSale, sale_price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Sale Date</Label>
                    <Input
                      type="date"
                      value={newSale.sale_date}
                      onChange={(e) => setNewSale({ ...newSale, sale_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Title Transfer Fee (ETB)</Label>
                    <Input
                      type="number"
                      value={newSale.title_transfer_fee}
                      onChange={(e) => setNewSale({ ...newSale, title_transfer_fee: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Stamp Duty (ETB)</Label>
                    <Input
                      type="number"
                      value={newSale.stamp_duty}
                      onChange={(e) => setNewSale({ ...newSale, stamp_duty: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newSale.notes}
                    onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSale} disabled={createSale.isPending}>
                  {createSale.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Register Sale
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sales Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Sale ID</th>
                  <th className="px-5 py-3 text-left">Parcel</th>
                  <th className="px-5 py-3 text-left">Seller</th>
                  <th className="px-5 py-3 text-left">Buyer</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                      <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No house sales found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, index) => (
                    <tr
                      key={sale.id}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                      )}
                    >
                      <td className="px-5 py-4 font-medium text-primary text-sm">
                        {sale.sale_id}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {sale.land_parcels?.parcel_id || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {sale.seller?.full_name || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {sale.buyer_name}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {formatCurrency(Number(sale.sale_price))}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {sale.sale_date}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          className={cn("text-xs capitalize", getStatusBadge(sale.status))}
                        >
                          {sale.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {sale.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {sale.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(sale.id)}
                              disabled={approveSale.isPending}
                            >
                              Approve
                            </Button>
                          )}
                          {sale.status === "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleComplete(sale.id)}
                              disabled={completeSale.isPending}
                            >
                              <FileCheck className="w-4 h-4 mr-1" />
                              Complete
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
