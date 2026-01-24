import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    MessageSquare,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    User,
    Home,
    Mail,
    Reply,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useInquiries, useRespondToInquiry } from "@/hooks/useInquiries";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Inquiries() {
    const { data: inquiries, isLoading } = useInquiries(true); // true = all inquiries for staff
    const respondToInquiry = useRespondToInquiry();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const [responseMessage, setResponseMessage] = useState("");

    const filteredInquiries = inquiries?.filter(i =>
        i.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.inquiry_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRespond = async () => {
        if (!responseMessage) return;
        try {
            await respondToInquiry.mutateAsync({
                id: selectedInquiry.id,
                response: responseMessage
            });
            setSelectedInquiry(null);
            setResponseMessage("");
        } catch (err) { }
    };

    return (
        <MainLayout
            title="Inquiry Management"
            subtitle="Review and respond to citizen messages and property interests"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, name or subject..."
                            className="pl-11 h-12 rounded-2xl bg-card border-border shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 bg-muted/30 p-1 rounded-2xl">
                        <Button variant="ghost" className="h-10 rounded-xl px-4 text-xs font-black uppercase tracking-widest bg-card shadow-sm">All</Button>
                        <Button variant="ghost" className="h-10 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Pending</Button>
                        <Button variant="ghost" className="h-10 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Responded</Button>
                    </div>
                </div>

                {/* Inquiries List */}
                <div className="grid gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 rounded-[2rem] bg-muted animate-pulse" />)
                    ) : filteredInquiries?.length === 0 ? (
                        <div className="p-20 text-center bg-card rounded-[3rem] border-2 border-dashed border-border">
                            <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium italic">No inquiries found matching your search.</p>
                        </div>
                    ) : (
                        filteredInquiries?.map((inquiry, idx) => (
                            <Card key={inquiry.id} className="rounded-[2.5rem] border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden group animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                                <CardContent className="p-8">
                                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                                        <div className="flex gap-6 items-start">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inquiry.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                                {inquiry.status === 'pending' ? <Clock size={28} /> : <CheckCircle2 size={28} />}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">{inquiry.inquiry_id}</span>
                                                    <h3 className="text-lg font-black text-foreground">{inquiry.subject}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl line-clamp-2 italic">
                                                    "{inquiry.message}"
                                                </p>
                                                <div className="flex flex-wrap gap-4 pt-2">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl">
                                                        <User size={14} className="text-primary" />
                                                        {inquiry.profiles?.full_name}
                                                    </div>
                                                    {inquiry.property_sales && (
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-100">
                                                            <Home size={14} className="text-blue-600" />
                                                            {inquiry.property_sales.title}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl">
                                                        <Clock size={14} className="text-primary" />
                                                        {format(new Date(inquiry.created_at), 'PPP')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 w-full lg:w-48 shrink-0">
                                            <Badge className={`h-10 rounded-xl justify-center font-black uppercase tracking-widest border-0 ${inquiry.status === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-emerald-500 text-white'}`}>
                                                {inquiry.status}
                                            </Badge>
                                            {inquiry.status === 'pending' ? (
                                                <Button
                                                    className="h-12 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                >
                                                    <Reply size={16} />
                                                    Respond
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 text-muted-foreground border-dashed" disabled>
                                                    <Mail size={16} />
                                                    Replied
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Response Dialog */}
                <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
                    <DialogContent className="rounded-[2.5rem] p-10 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Send Response</DialogTitle>
                            <DialogDescription className="font-medium">
                                Drafting a reply to {selectedInquiry?.profiles?.full_name} regarding "{selectedInquiry?.subject}".
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="p-6 bg-muted/50 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Inquiry</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedInquiry?.inquiry_id}</p>
                                </div>
                                <p className="text-sm font-medium leading-relaxed italic text-slate-700">
                                    "{selectedInquiry?.message}"
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest px-1">Your Response</Label>
                                <Textarea
                                    placeholder="Type your official response here..."
                                    className="min-h-[200px] rounded-[2rem] bg-muted/50 border-0 p-8 font-medium text-sm focus-visible:ring-primary"
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                />
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                    The citizen will receive a real-time notification once you submit this response. Be clear and professional.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="gap-4">
                            <Button variant="ghost" className="h-14 rounded-2xl font-bold px-8" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
                            <Button
                                className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-primary/20"
                                onClick={handleRespond}
                                disabled={respondToInquiry.isPending || !responseMessage}
                            >
                                {respondToInquiry.isPending ? <Loader2 className="animate-spin mr-2" /> : "Submit Response"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
