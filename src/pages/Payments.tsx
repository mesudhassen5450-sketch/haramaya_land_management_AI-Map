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
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Receipt,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePayments, usePaymentStats, useCreatePayment } from "@/hooks/usePayments";
import { useTaxAssessments } from "@/hooks/useTaxAssessments";
import { PaymentHistoryChart } from "@/components/charts/PaymentHistoryChart";
import { PaymentMethodChart } from "@/components/charts/PaymentMethodChart";
import { toast } from "sonner";

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tax_assessment_id: "",
    amount: "",
    payment_method: "bank_transfer",
    bank_name: "",
    reference_number: "",
    notes: "",
  });

  const { data: payments, isLoading } = usePayments();
  const { data: stats, isLoading: statsLoading } = usePaymentStats();
  const { data: taxAssessments } = useTaxAssessments();
  const createPayment = useCreatePayment();

  // Get pending tax assessments for payment
  const pendingTaxes = taxAssessments?.filter((t) => t.status !== "paid") || [];

  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch =
      payment.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tax_assessments?.land_parcels?.land_owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod =
      methodFilter === "all" || payment.payment_method === methodFilter;
    return matchesSearch && matchesMethod;
  }) || [];

  const handleCreatePayment = async () => {
    if (!newPayment.tax_assessment_id || !newPayment.amount) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createPayment.mutateAsync({
        tax_assessment_id: newPayment.tax_assessment_id,
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.payment_method,
        bank_name: newPayment.bank_name || null,
        reference_number: newPayment.reference_number || null,
        notes: newPayment.notes || null,
      });
      toast.success("Payment recorded successfully");
      setIsDialogOpen(false);
      setNewPayment({
        tax_assessment_id: "",
        amount: "",
        payment_method: "bank_transfer",
        bank_name: "",
        reference_number: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to record payment");
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(1)}K`;
    return `ETB ${amount.toFixed(0)}`;
  };

  const paymentMethods = [
    {
      method: "Bank Transfer",
      key: "bank_transfer",
      amount: stats?.byMethod?.bank_transfer || 0,
      icon: Building2,
      color: "text-primary",
    },
    {
      method: "Mobile Money",
      key: "mobile_money",
      amount: stats?.byMethod?.mobile_money || 0,
      icon: Smartphone,
      color: "text-accent",
    },
    {
      method: "Cash",
      key: "cash",
      amount: stats?.byMethod?.cash || 0,
      icon: Banknote,
      color: "text-secondary-foreground",
    },
  ];

  return (
    <MainLayout
      title="Payments"
      subtitle="Revenue collection and payment tracking"
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
              title="Total Collected"
              value={formatCurrency(stats?.totalCollected || 0)}
              change="All time"
              changeType="positive"
              icon={CreditCard}
              variant="primary"
            />
            <StatCard
              title="This Month"
              value={formatCurrency(stats?.thisMonthTotal || 0)}
              change="Current month"
              changeType="positive"
              icon={TrendingUp}
              variant="gold"
            />
            <StatCard
              title="Transactions"
              value={stats?.transactionCount || 0}
              change="Total payments"
              changeType="neutral"
              icon={Receipt}
            />
            <StatCard
              title="Pending Taxes"
              value={pendingTaxes.length}
              change="Awaiting payment"
              changeType="neutral"
              icon={Clock}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Transaction Trends */}
        <PaymentHistoryChart />

        {/* Payment Methods Chart */}
        <PaymentMethodChart />
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {paymentMethods.map((item, index) => (
          <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-muted", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.method}</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by receipt, payer, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-40">
              <CreditCard className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
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
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Enter payment details for a tax assessment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Tax Assessment *</Label>
                  <Select
                    value={newPayment.tax_assessment_id}
                    onValueChange={(value) => {
                      const tax = pendingTaxes.find((t) => t.id === value);
                      setNewPayment({
                        ...newPayment,
                        tax_assessment_id: value,
                        amount: tax ? tax.total_due.toString() : "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax assessment" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingTaxes.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id}>
                          {tax.tax_id} - {tax.land_parcels?.land_owners?.full_name || "Unknown"} ({formatCurrency(Number(tax.total_due))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount (ETB) *</Label>
                    <Input
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={newPayment.payment_method}
                      onValueChange={(value) => setNewPayment({ ...newPayment, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Bank/Provider</Label>
                    <Input
                      value={newPayment.bank_name}
                      onChange={(e) => setNewPayment({ ...newPayment, bank_name: e.target.value })}
                      placeholder="e.g., CBE, Telebirr"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Reference Number</Label>
                    <Input
                      value={newPayment.reference_number}
                      onChange={(e) => setNewPayment({ ...newPayment, reference_number: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePayment} disabled={createPayment.isPending}>
                  {createPayment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payment Records Table */}
      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Receipt #</th>
                  <th className="px-5 py-3 text-left">Tax ID</th>
                  <th className="px-5 py-3 text-left">Payer</th>
                  <th className="px-5 py-3 text-left">Amount</th>
                  <th className="px-5 py-3 text-left">Method</th>
                  <th className="px-5 py-3 text-left">Bank/Provider</th>
                  <th className="px-5 py-3 text-left">Reference</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((record, index) => (
                    <tr
                      key={record.id}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                      )}
                    >
                      <td className="px-5 py-4 font-medium text-foreground text-sm">
                        {record.receipt_number}
                      </td>
                      <td className="px-5 py-4 text-sm text-primary font-medium">
                        {record.tax_assessments?.tax_id || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">
                        {record.tax_assessments?.land_parcels?.land_owners?.full_name || "Unknown"}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {formatCurrency(Number(record.amount))}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground capitalize">
                        {record.payment_method.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {record.bank_name || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground font-mono text-xs">
                        {record.reference_number || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {record.payment_date?.split("T")[0] || "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Receipt
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
      )}
    </MainLayout>
  );
}
