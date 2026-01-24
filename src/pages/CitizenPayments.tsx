import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Receipt,
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle,
    History,
    Download,
    Loader2,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useCitizenPayments,
    useCitizenTaxAssessments,
    useCitizenPayTax,
} from "@/hooks/useCitizenData";
import { toast } from "sonner";

export default function CitizenPayments() {
    const [activeTab, setActiveTab] = useState("assessments");
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "mobile_money">("mobile_money");
    const [selectedPaymentRecord, setSelectedPaymentRecord] = useState<any>(null);

    const { data: payments, isLoading: paymentsLoading } = useCitizenPayments();
    const { data: taxAssessments, isLoading: taxLoading } = useCitizenTaxAssessments();
    const payTax = useCitizenPayTax();

    const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

    const totalTaxDue = taxAssessments
        ?.filter((t: any) => t.status === "pending" || t.status === "overdue")
        .reduce((acc: number, curr: any) => acc + Number(curr.total_due), 0) || 0;

    const totalPaid = payments
        ?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;

    const handlePayTax = async () => {
        if (!selectedBill) return;

        const loadingToast = toast.loading("Connecting to secure payment gateway...");
        try {
            // Simulate gateway processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            await payTax.mutateAsync({
                taxAssessmentId: selectedBill.id,
                amount: Number(selectedBill.total_due),
                paymentMethod: paymentMethod,
            });

            toast.dismiss(loadingToast);
            toast.success("Payment successful! Receipt generated.", {
                description: "Your municipal record has been updated instantly.",
                icon: <CheckCircle className="text-emerald-500" />,
            });
            setPaymentDialogOpen(false);
            setSelectedBill(null);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Payment failed", {
                description: "Gateway error. Please try again or contact your bank.",
            });
        }
    };

    const initiatePayment = (bill: any) => {
        setSelectedBill(bill);
        setPaymentDialogOpen(true);
    };

    return (
        <MainLayout
            title="Payments & Taxation"
            subtitle="Manage your property tax obligations and view payment records"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Statistics Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[2.5rem] border-0 bg-primary shadow-xl shadow-primary/20 text-primary-foreground overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet size={80} />
                        </div>
                        <CardContent className="p-8">
                            <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Tax Due</p>
                            <h2 className="text-4xl font-black mb-4">{formatCurrency(totalTaxDue)}</h2>
                            <div className="flex items-center gap-2 text-xs bg-black/10 w-fit px-3 py-1.5 rounded-full">
                                <TrendingUp size={14} className="text-rose-300" />
                                <span className="text-primary-foreground/80 font-medium">Pending Assessment</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border bg-card shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <CheckCircle size={80} />
                        </div>
                        <CardContent className="p-8">
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Contributed</p>
                            <h2 className="text-4xl font-black mb-4 text-foreground">{formatCurrency(totalPaid)}</h2>
                            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
                                <TrendingDown size={14} className="text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Lifetime Total</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border bg-card shadow-sm flex items-center p-8">
                        <div className="space-y-4 w-full">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <AlertCircle className="text-amber-500" size={20} />
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="rounded-2xl h-12 text-xs font-bold" onClick={() => setActiveTab("assessments")}>Pay Bill</Button>
                                <Button variant="outline" className="rounded-2xl h-12 text-xs font-bold" onClick={() => setActiveTab("history")}>History</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-muted/50 p-1.5 rounded-[2rem] border border-border h-16 w-fit">
                        <TabsTrigger value="assessments" className="rounded-[1.5rem] px-8 h-full gap-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            <Receipt className="w-4 h-4" />
                            Tax Assessments
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-[1.5rem] px-8 h-full gap-2 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            <History className="w-4 h-4" />
                            Payment History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="assessments" className="animate-slide-up">
                        <Card className="rounded-[2.5rem] border-border bg-card shadow-md overflow-hidden">
                            <CardContent className="p-0">
                                {taxLoading ? (
                                    <div className="p-8 space-y-4">
                                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                                    </div>
                                ) : taxAssessments && taxAssessments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-muted/30 border-b border-border">
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reference</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Parcel ID</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Year</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {taxAssessments.map((tax: any) => (
                                                    <tr key={tax.id} className="hover:bg-muted/10 transition-colors group">
                                                        <td className="px-8 py-6 text-sm font-bold text-foreground">{tax.tax_id}</td>
                                                        <td className="px-8 py-6 text-sm text-primary font-medium">{tax.land_parcels?.parcel_id}</td>
                                                        <td className="px-8 py-6 text-sm text-muted-foreground">{tax.fiscal_year}</td>
                                                        <td className="px-8 py-6 text-sm font-black text-foreground">{formatCurrency(Number(tax.total_due))}</td>
                                                        <td className="px-8 py-6">
                                                            <Badge
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                                                                    tax.status === "paid" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                                                    tax.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                                                    tax.status === "overdue" && "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                                                )}
                                                            >
                                                                {tax.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {tax.status !== "paid" && (
                                                                <Button
                                                                    size="sm"
                                                                    className="rounded-xl h-10 px-6 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                                                    onClick={() => initiatePayment(tax)}
                                                                >
                                                                    Pay Now
                                                                </Button>
                                                            )}
                                                            {tax.status === "paid" && (
                                                                <Button variant="ghost" size="sm" className="rounded-xl h-10 px-6 font-bold text-emerald-600 group-hover:bg-emerald-500/5">
                                                                    <CheckCircle size={14} className="mr-2" />
                                                                    Settled
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                                        <p className="text-muted-foreground italic">No tax assessments found.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="animate-slide-up">
                        <Card className="rounded-[2.5rem] border-border bg-card shadow-md overflow-hidden">
                            <CardContent className="p-0">
                                {paymentsLoading ? (
                                    <div className="p-8"><Skeleton className="h-48 rounded-2xl" /></div>
                                ) : payments && payments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-muted/30 border-b border-border">
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Receipt #</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reference</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Export</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {payments.map((payment: any) => (
                                                    <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                                                        <td className="px-8 py-6 text-sm font-bold text-foreground">{payment.receipt_number}</td>
                                                        <td className="px-8 py-6 text-sm text-primary font-medium">{payment.tax_assessments?.tax_id}</td>
                                                        <td className="px-8 py-6 text-sm font-black text-foreground">{formatCurrency(Number(payment.amount))}</td>
                                                        <td className="px-8 py-6 text-sm text-muted-foreground">{payment.payment_date?.split("T")[0]}</td>
                                                        <td className="px-8 py-6 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="rounded-xl h-10 px-4 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                                onClick={() => setSelectedPaymentRecord(payment)}
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 italic text-muted-foreground">No payment history available.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Payment Confirmation Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="rounded-[2.5rem] border-border bg-card p-10 max-w-lg">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-2xl font-black text-foreground">Confirm Secure Payment</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium"> You are initiating a property tax settlement for ID: {selectedBill?.tax_id} </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8">
                        <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] flex flex-col items-center text-center">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Total Amount Due</span>
                            <h4 className="text-4xl font-black text-foreground">{formatCurrency(Number(selectedBill?.total_due))}</h4>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Select Payment Medium</Label>
                            <Select value={paymentMethod} onValueChange={(v: "bank" | "mobile_money") => setPaymentMethod(v)}>
                                <SelectTrigger className="h-14 rounded-2xl border-border bg-background px-6 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border">
                                    <SelectItem value="mobile_money" className="rounded-xl my-1">Telebirr / M-Pesa (Mobile)</SelectItem>
                                    <SelectItem value="bank" className="rounded-xl my-1">CBE / Awash / BOA (Bank)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-2xl border border-border flex items-start gap-3">
                            <AlertCircle size={18} className="text-primary mt-1 flex-shrink-0" />
                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">This transaction will be processed through the municipal secure gateway. A digital certificate of payment will be issued instantly upon success.</p>
                        </div>
                    </div>

                    <DialogFooter className="mt-10 sm:justify-center gap-4">
                        <Button variant="ghost" className="rounded-2xl h-14 px-8 font-bold text-muted-foreground" onClick={() => setPaymentDialogOpen(false)}>Abort</Button>
                        <Button className="rounded-2xl h-14 px-10 font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-md" onClick={handlePayTax} disabled={payTax.isPending}>
                            {payTax.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                            Finalize Settlement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Receipt Dialog */}
            <Dialog open={!!selectedPaymentRecord} onOpenChange={() => setSelectedPaymentRecord(null)}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-border bg-card p-0 overflow-hidden">
                    {selectedPaymentRecord && (
                        <div className="flex flex-col">
                            <div className="bg-primary p-12 text-center text-primary-foreground relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={120} /></div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Payment Settled</h3>
                                <p className="text-primary-foreground/60 font-bold uppercase tracking-widest text-[10px]">Official Digital Receipt</p>
                            </div>

                            <div className="p-10 space-y-8 bg-card relative z-10 -mt-6 rounded-t-[3rem] shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Receipt Number</p>
                                        <p className="font-black text-foreground">{selectedPaymentRecord.receipt_number}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date Issued</p>
                                        <p className="font-black text-foreground">{selectedPaymentRecord.payment_date?.split("T")[0]}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tax Reference</p>
                                        <p className="font-black text-primary">{selectedPaymentRecord.tax_assessments?.tax_id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Amount Paid</p>
                                        <p className="font-black text-foreground">{formatCurrency(Number(selectedPaymentRecord.amount))}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
                                    <CheckCircle className="text-emerald-500" size={32} />
                                    <p className="text-xs font-bold text-slate-800">Verified by Haramaya Wereda Municipal Digital Finance System</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{selectedPaymentRecord.id}</p>
                                </div>

                                <Button className="w-full h-14 rounded-2xl font-bold gap-2" variant="outline">
                                    <Download size={18} />
                                    Download PDF Document
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
