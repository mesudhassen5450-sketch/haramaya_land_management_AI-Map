import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    FileText,
    Download,
    ShieldCheck,
    FileBadge,
    FilePlus,
    BookOpen,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CitizenDocuments() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const documents = [
        {
            id: "1",
            title: "Land Title Deed - HP-2024-1847",
            type: "legal",
            date: "2024-05-12",
            size: "2.4 MB",
            verified: true
        },
        {
            id: "2",
            title: "Property Tax Receipt - 2025",
            type: "receipt",
            date: "2025-12-15",
            size: "840 KB",
            verified: true
        },
        {
            id: "3",
            title: "Municipal Land Usage Permit",
            type: "permit",
            date: "2024-06-01",
            size: "1.1 MB",
            verified: true
        },
        {
            id: "4",
            title: "Boundary Survey Certificate",
            type: "legal",
            date: "2024-05-20",
            size: "3.2 MB",
            verified: true
        }
    ];

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || doc.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <MainLayout
            title="Digital Document Vault"
            subtitle="Access and download your official land documents and legal certificates"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Search and Category Strip */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-muted/20 p-8 rounded-[2.5rem] border border-border">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-12 rounded-xl bg-background border-border"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            className="rounded-xl h-10 px-6 font-bold text-xs"
                            onClick={() => setFilter("all")}
                        >All</Button>
                        <Button
                            variant={filter === "legal" ? "default" : "outline"}
                            className="rounded-xl h-10 px-6 font-bold text-xs"
                            onClick={() => setFilter("legal")}
                        >Title Deeds</Button>
                        <Button
                            variant={filter === "receipt" ? "default" : "outline"}
                            className="rounded-xl h-10 px-6 font-bold text-xs"
                            onClick={() => setFilter("receipt")}
                        >Receipts</Button>
                        <Button
                            variant={filter === "permit" ? "default" : "outline"}
                            className="rounded-xl h-10 px-6 font-bold text-xs"
                            onClick={() => setFilter("permit")}
                        >Permits</Button>
                    </div>
                </div>

                {/* Quick Help / Upload Hint */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[2rem] border-border bg-emerald-500/5 p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-emerald-900">Blockchain Verified</h4>
                            <p className="text-[10px] text-emerald-700/70 font-bold leading-relaxed mt-1">All digital title deeds are cryptographically signed by the municipal authority for absolute security.</p>
                        </div>
                    </Card>
                    <Card className="rounded-[2rem] border-border bg-blue-500/5 p-6 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <FileBadge size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-blue-900">Official Certification</h4>
                            <p className="text-[10px] text-blue-700/70 font-bold leading-relaxed mt-1">Digital copies carry the same legal weight as physical counterparts in all administrative processes.</p>
                        </div>
                    </Card>
                    <Card className="rounded-[2rem] border-border bg-amber-500/5 p-6 flex items-start gap-4 cursor-pointer hover:bg-amber-500/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <FilePlus size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-amber-900">Submit External Records</h4>
                            <p className="text-[10px] text-amber-700/70 font-bold leading-relaxed mt-1">Uploading legacy paper documents for digital conversion? Click here to start the digitization request.</p>
                        </div>
                    </Card>
                </div>

                {/* Documents Table Interface */}
                <Card className="rounded-[2.5rem] border-border bg-card shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border">
                                        <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Document Title</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date Issued</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">File Size</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredDocs.map((doc, index) => (
                                        <tr key={doc.id} className="hover:bg-muted/10 transition-colors group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center text-muted-foreground group-hover:text-primary">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-foreground">{doc.title}</p>
                                                        {doc.verified && (
                                                            <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                                                                <ShieldCheck size={10} />
                                                                Verified Asset
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-border text-muted-foreground group-hover:border-primary/20 group-hover:text-primary transition-colors">
                                                    {doc.type}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-8 text-sm font-bold text-muted-foreground">{doc.date}</td>
                                            <td className="px-8 py-8 text-[10px] font-mono font-bold text-muted-foreground/60 tracking-widest">{doc.size}</td>
                                            <td className="px-10 py-8 text-right">
                                                <Button size="sm" variant="ghost" className="rounded-xl h-12 w-12 hover:bg-primary hover:text-primary-foreground shadow-sm transition-all">
                                                    <Download size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredDocs.length === 0 && (
                            <div className="text-center py-20 italic font-medium text-muted-foreground">
                                <BookOpen size={40} className="mx-auto mb-4 opacity-10" />
                                No documents found matching your filters.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
