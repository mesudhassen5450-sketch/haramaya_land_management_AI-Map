import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Receipt,
  Scale,
  FileText,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Link2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCitizenParcels,
  useCitizenPayments,
  useCitizenTaxAssessments,
  useCitizenLandOwner,
  useLinkOwner,
} from "@/hooks/useCitizenData";
import { ValueAppreciationChart, TaxAllocationChart } from "@/components/dashboard/CitizenCharts";
import { useCreateInquiry } from "@/hooks/useInquiries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CitizenPortal() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { data: parcels, isLoading: parcelsLoading } = useCitizenParcels();
  const { data: payments } = useCitizenPayments();
  const { data: taxAssessments } = useCitizenTaxAssessments();
  const { data: owner, isLoading: ownerLoading } = useCitizenLandOwner();
  const linkOwner = useLinkOwner();
  const createInquiry = useCreateInquiry();

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

  const totalTaxDue = taxAssessments
    ?.filter((t: any) => t.status === "pending" || t.status === "overdue")
    .reduce((acc: number, curr: any) => acc + Number(curr.total_due), 0) || 0;

  const totalPaid = payments
    ?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;

  const handleLinkAccount = async () => {
    if (!nationalId) {
      toast.error("Please enter your National ID");
      return;
    }

    try {
      await linkOwner.mutateAsync(nationalId);
      toast.success("Account successfully linked to your land records!");
      setIsLinkDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to link account");
    }
  };

  const handleSubmitInquiry = async () => {
    if (!inquirySubject || !inquiryMessage) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createInquiry.mutateAsync({
        subject: inquirySubject,
        message: inquiryMessage,
        category: 'general'
      });
      setIsInquiryDialogOpen(false);
      setInquirySubject("");
      setInquiryMessage("");
    } catch (error: any) {
      // Error already handled by hook
    }
  };

  const quickLinks = [
    {
      title: "My Properties",
      desc: "View land parcels & GIS maps",
      icon: MapPin,
      path: "/my-properties",
      color: "blue",
      count: parcels?.length || 0
    },
    {
      title: "Tax & Payments",
      desc: "Settle dues & view history",
      icon: Receipt,
      path: "/my-payments",
      color: "emerald",
      amount: formatCurrency(totalTaxDue)
    },
    {
      title: "Dispute Center",
      desc: "Legal cases & resolution",
      icon: Scale,
      path: "/my-disputes",
      color: "amber",
      count: 1 // Mock or fetch active disputes
    },
    {
      title: "Digital Vault",
      desc: "Retrieve certified documents",
      icon: FileText,
      path: "/my-documents",
      color: "purple"
    }
  ];

  return (
    <MainLayout
      title="Citizen Overview"
      subtitle="Your central command center for land and municipal affairs"
    >
      <div className="space-y-10 animate-fade-in">
        {/* Hero Welcome Section */}
        <div className="relative rounded-[3rem] bg-slate-900 p-12 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
            <ShieldCheck size={240} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] font-black tracking-widest uppercase mb-6">
              <Zap size={14} />
              Live Municipal Status
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Welcome back, <span className="text-brand-gold">{profile?.full_name?.split(' ')[0] || "Citizen"}</span>
            </h1>
            <p className="text-brand-light/60 text-lg font-medium leading-relaxed">
              Your property records are up to date. You have {parcels?.length || 0} registered assets spanning {parcels?.reduce((acc: number, p: any) => acc + (p.area_sqm || 0), 0).toLocaleString()} square meters of land.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Card
              key={link.title}
              className="group rounded-[2.5rem] border-border bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(link.path)}
            >
              <CardContent className="p-8">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors
                  ${link.color === 'blue' ? 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white' : ''}
                  ${link.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : ''}
                  ${link.color === 'amber' ? 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : ''}
                  ${link.color === 'purple' ? 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white' : ''}
                `}>
                  <link.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">{link.desc}</p>

                <div className="flex items-center justify-between mt-auto">
                  {link.count !== undefined && (
                    <div className="px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {link.count} items
                    </div>
                  )}
                  {link.amount !== undefined && (link.amount !== 'ETB 0') && (
                    <div className="px-3 py-1 rounded-full bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-500/20">
                      {link.amount} DUE
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all ml-auto">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ValueAppreciationChart />
          <TaxAllocationChart />
        </div>

        {/* Recent Transactions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-foreground">Recent Transactions</h3>
            <Button variant="ghost" className="text-primary font-bold gap-2" onClick={() => navigate("/my-payments")}>
              View Statement
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid gap-4">
            {payments?.slice(0, 3).map((payment: any, idx: number) => (
              <Card key={payment.id} className="rounded-3xl border-border bg-card/50 hover:bg-card transition-colors p-6 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Receipt size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Tax Payment - {payment.tax_assessments?.tax_id}</p>
                      <p className="text-xs text-muted-foreground font-medium">{new Date(payment.payment_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">-{formatCurrency(Number(payment.amount))}</p>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[8px] uppercase tracking-widest font-bold border-0">Success</Badge>
                  </div>
                </div>
              </Card>
            ))}
            {(!payments || payments.length === 0) && (
              <div className="text-center py-12 bg-muted/20 rounded-[2.5rem] border border-dashed border-border italic text-muted-foreground text-sm">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

        {/* Quick Inquiry Section */}
        <Card className="rounded-[3rem] border-border bg-gradient-to-br from-primary/5 via-card to-card p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MessageSquare size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-2">Have a Question?</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                  Submit an inquiry about your properties, taxes, or any municipal services. Our staff will respond within 24-48 hours.
                </p>
              </div>
            </div>
            <Button
              className="h-14 rounded-2xl px-10 font-black gap-2 shadow-xl shadow-primary/20 shrink-0"
              onClick={() => setIsInquiryDialogOpen(true)}
            >
              <MessageSquare size={18} />
              Submit Inquiry
            </Button>
          </div>
        </Card>

        {/* Support Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {!owner && !ownerLoading && (
            <Card className="rounded-[3rem] border-dashed border-primary/40 bg-primary/5 p-10 flex flex-col items-center text-center justify-center lg:col-span-2 animate-pulse-slow">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Link2 size={40} />
              </div>
              <h3 className="text-xl font-black text-foreground mb-4">Link Your Land Records</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 px-4 max-w-md">
                We couldn't find any registered land records linked to your account. If you already own land in Haramaya, link your records using your National ID.
              </p>
              <Button
                onClick={() => setIsLinkDialogOpen(true)}
                className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20"
              >
                Link Property Records Now
              </Button>
            </Card>
          )}

          <Card className={`${!owner ? 'lg:col-span-1' : 'lg:col-span-3'} rounded-[3rem] border-border bg-card p-10 flex flex-col items-center text-center justify-center`}>
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-black text-foreground mb-4">Need Official Help?</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 px-4 max-w-md">
              If you have questions regarding your properties or taxation, you can message a case officer directly.
            </p>
            <Button variant="outline" className="w-full max-w-xs rounded-2xl h-14 font-black">
              Start Direct Inquiry
            </Button>
          </Card>
        </div>
      </div>

      {/* Account Linking Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Link Land Records</DialogTitle>
            <DialogDescription className="font-medium">
              Enter the National ID associated with your land registration documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="nationalId" className="text-[10px] font-black uppercase tracking-widest px-1">National ID Number</Label>
              <Input
                id="nationalId"
                placeholder="e.g. ID-12345678"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="h-14 rounded-2xl px-6 font-bold bg-muted/50 border-0 focus-visible:ring-primary"
              />
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                Your National ID must exactly match the one on record with the Municipal Office. Linking allows you to view property status and pay taxes online.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-4">
            <Button variant="ghost" className="rounded-2xl h-14 font-bold" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
            <Button
              className="rounded-2xl h-14 flex-1 font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              onClick={handleLinkAccount}
              disabled={linkOwner.isPending}
            >
              {linkOwner.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Link2 className="w-5 h-5 mr-2" />}
              Verify & Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Submit an Inquiry</DialogTitle>
            <DialogDescription className="font-medium">
              Ask us anything about your properties, taxes, or municipal services.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest px-1">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Question about property tax assessment"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                className="h-14 rounded-2xl px-6 font-bold bg-muted/50 border-0 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest px-1">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your question or concern in detail..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="min-h-[180px] rounded-2xl px-6 py-4 font-medium bg-muted/50 border-0 focus-visible:ring-primary"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                Your inquiry will be reviewed by our staff. You'll receive a notification when we respond.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-4">
            <Button variant="ghost" className="rounded-2xl h-14 font-bold" onClick={() => setIsInquiryDialogOpen(false)}>Cancel</Button>
            <Button
              className="rounded-2xl h-14 flex-1 font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              onClick={handleSubmitInquiry}
              disabled={createInquiry.isPending}
            >
              {createInquiry.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
              Send Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
