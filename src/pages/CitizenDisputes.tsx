import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
    Plus,
    Scale,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText,
    Gavel,
    Image as ImageIcon,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CitizenDisputes() {
    const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState<any>(null);

    // Mock data for disputes (since we don't have a specific citizen disputes hook yet, 
    // or we could use the general one but filtered. For this UI demo, mock is safer)
    const [disputes] = useState([
        {
            id: "1",
            dispute_id: "DSP-2026-001",
            title: "Boundary Encroachment - Maya Laman",
            type: "Boundary Conflict",
            status: "pending",
            created_at: "2026-01-10",
            description: "My neighbor has built a temporary fence extending 2 meters into my registered plot HP-2024-1847.",
            priority: "high"
        },
        {
            id: "2",
            dispute_id: "DSP-2025-089",
            title: "Ownership Verification - Girdho",
            type: "Title Dispute",
            status: "resolved",
            created_at: "2025-11-20",
            description: "Conflicting claims over inherited land parcel HP-2025-0922.",
            priority: "medium",
            resolution: "Ownership verified in favor of current claimant based on 2006 records."
        }
    ]);

    const handleNewDispute = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Dispute filed successfully! A case officer will be assigned shortly.");
        setDisputeDialogOpen(false);
    };

    return (
        <MainLayout
            title="Dispute Resolution Center"
            subtitle="Report land conflicts and track the legal resolution process"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20 p-8 rounded-[2.5rem] border border-border">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                            <Scale className="text-primary" />
                            Active Legal Cases
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">Protect your property rights through official channels.</p>
                    </div>
                    <Button
                        onClick={() => setDisputeDialogOpen(true)}
                        className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus size={20} />
                        File New Dispute
                    </Button>
                </div>

                {/* Disputes List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {disputes.map((dispute, index) => (
                        <Card
                            key={dispute.id}
                            className="rounded-[2.5rem] border-border bg-card hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedDispute(dispute)}
                        >
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                                        <Gavel className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <Badge
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            dispute.status === "resolved" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                            dispute.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                            dispute.status === "in_review" && "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                        )}
                                    >
                                        {dispute.status}
                                    </Badge>
                                </div>

                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{dispute.dispute_id}</span>
                                    <h4 className="text-xl font-black text-foreground mt-1 mb-2 line-clamp-1">{dispute.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">{dispute.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                        <Clock size={14} />
                                        Established {dispute.created_at}
                                    </div>
                                    <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                                        Detail Report
                                        <Plus size={12} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {disputes.length === 0 && (
                    <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border">
                        <Scale className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h3 className="text-xl font-black text-foreground">No property disputes found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto font-medium">Your property rights are clear. If you have any conflicts, use the "File New Dispute" button to start the resolution process.</p>
                    </div>
                )}
            </div>

            {/* New Dispute Dialog */}
            <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
                <DialogContent className="rounded-[2.5rem] border-border bg-card p-10 max-w-2xl">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-2xl font-black text-foreground">Initiate Dispute Case</DialogTitle>
                        <DialogDescription className="font-medium">Please provide accurate details regarding the land conflict. Official reviewers will assess the evidence.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleNewDispute} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Dispute Title</Label>
                                <Input placeholder="e.g., Illegal Plot Slicing" className="h-14 rounded-2xl border-border bg-muted/30 font-bold" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Case Type</Label>
                                <Select required>
                                    <SelectTrigger className="h-14 rounded-2xl border-border bg-muted/30 font-bold">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="boundary">Boundary Conflict</SelectItem>
                                        <SelectItem value="ownership">Title / Ownership Dispute</SelectItem>
                                        <SelectItem value="usage">Unauthorized Usage</SelectItem>
                                        <SelectItem value="inheritance">Inheritance Claim</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Affected Parcel ID</Label>
                            <Input placeholder="HP-XXXX-XXXX" className="h-14 rounded-2xl border-border bg-muted/30 font-bold" required />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Context & Description</Label>
                            <Textarea
                                placeholder="Detail the nature of the conflict, parties involved, and the specific location..."
                                className="rounded-2xl border-border bg-muted/30 font-medium min-h-[120px] p-4"
                                required
                            />
                        </div>

                        <div className="p-8 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group bg-muted/10">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <ImageIcon size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-foreground">Attach Legal Evidence</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Photos, Deeds, or Affidavits (Max 10MB)</p>
                            </div>
                        </div>

                        <DialogFooter className="mt-8 gap-4 pt-6 border-t border-border">
                            <Button type="button" variant="ghost" className="rounded-2xl h-14 px-8 font-bold text-muted-foreground" onClick={() => setDisputeDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="rounded-2xl h-14 px-10 font-black gap-2 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                                <Send size={18} />
                                Submit Formal Claim
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail View Dialog */}
            <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
                <DialogContent className="rounded-[2.5rem] border-border bg-card p-0 overflow-hidden max-w-2xl shadow-2xl">
                    {selectedDispute && (
                        <div className="flex flex-col">
                            <div className="bg-slate-900 p-10 text-white relative">
                                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Scale size={180} /></div>
                                <Badge className="mb-4 bg-primary/20 text-brand-gold border-brand-gold/30 rounded-full font-black uppercase tracking-widest">{selectedDispute.status}</Badge>
                                <h2 className="text-3xl font-black mb-1">{selectedDispute.title}</h2>
                                <p className="text-brand-light/60 font-mono text-sm uppercase tracking-widest">{selectedDispute.dispute_id}</p>
                            </div>

                            <div className="p-10 space-y-8 bg-card relative z-10 -mt-6 rounded-t-[3rem]">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Established On</p>
                                        <p className="font-black text-foreground">{selectedDispute.created_at}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Dispute Category</p>
                                        <p className="font-black text-foreground">{selectedDispute.type}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Description of Claim</p>
                                    <div className="p-6 bg-muted/30 rounded-2xl border border-border text-sm leading-relaxed text-foreground font-medium italic">
                                        "{selectedDispute.description}"
                                    </div>
                                </div>

                                {selectedDispute.resolution && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 px-1">Official Resolution</p>
                                        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-sm leading-relaxed text-emerald-900 font-bold border-l-4 border-l-emerald-500">
                                            {selectedDispute.resolution}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Button className="flex-1 h-14 rounded-2xl font-black gap-2" variant="outline">
                                        <MessageSquare size={18} />
                                        Message Officer
                                    </Button>
                                    {selectedDispute.status === "resolved" && (
                                        <Button className="flex-1 h-14 rounded-2xl font-black gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
                                            <CheckCircle size={18} />
                                            Final Decision PDF
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
