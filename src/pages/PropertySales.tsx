import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    MapPin,
    Maximize2,
    TrendingUp,
    Plus,
    Search,
    Filter,
    LandPlot,
    MessageSquare,
    AlertCircle,
    Loader2
} from "lucide-react";
import { usePropertySales, useCreatePropertySale } from "@/hooks/usePropertySales";
import { useCreateInquiry } from "@/hooks/useInquiries";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function PropertySales() {
    const { profile } = useAuth();
    const { data: sales, isLoading } = usePropertySales('land');
    const createSale = useCreatePropertySale();
    const createInquiry = useCreateInquiry();
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [inquiryProperty, setInquiryProperty] = useState<any>(null);
    const [inquiryMessage, setInquiryMessage] = useState("");

    const filteredSales = sales?.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.land_parcels?.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSale = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const parcel_id = formData.get("parcel_id") as string;

        // Validation
        if (!title || !price || !parcel_id) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!profile?.id) {
            toast.error("You must be logged in to list a property");
            return;
        }

        const newSale = {
            title,
            description: description || "",
            price,
            listing_type: 'land' as const,
            parcel_id,
            seller_id: profile.id,
            status: 'available' as const,
            images: [] as string[],
        };

        try {
            await createSale.mutateAsync(newSale);
            setIsCreateOpen(false);
            toast.success("Property listed successfully!");
            e.currentTarget.reset();
        } catch (err: any) {
            toast.error(err.message || "Failed to create listing");
        }
    };

    const handleInquiry = async () => {
        if (!inquiryMessage) {
            toast.error("Please enter a message");
            return;
        }

        try {
            await createInquiry.mutateAsync({
                property_id: inquiryProperty.id,
                subject: `Inquiry about ${inquiryProperty.title}`,
                message: inquiryMessage,
                category: 'property_sale'
            });
            setInquiryProperty(null);
            setInquiryMessage("");
        } catch (err) { }
    };

    return (
        <MainLayout
            title="Land Marketplace"
            subtitle="Discover and acquire prime land parcels in Haramaya"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title or location..."
                            className="pl-11 h-12 rounded-2xl bg-card border-border shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold px-6">
                            <Filter size={18} />
                            Filters
                        </Button>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-12 rounded-2xl gap-2 font-black px-8 shadow-xl shadow-primary/20">
                                    <Plus size={18} />
                                    List Property
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl rounded-[2.5rem] p-10">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">List Your Land</DialogTitle>
                                    <DialogDescription className="font-medium">
                                        Create a new public listing for your land parcel.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateSale} className="space-y-6 py-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest px-1">Listing Title</Label>
                                            <Input name="title" placeholder="e.g. Prime Residential Land" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest px-1">Asking Price (ETB)</Label>
                                            <Input name="price" type="number" placeholder="500,000" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest px-1">Parcel UUID</Label>
                                        <Input name="parcel_id" placeholder="Paste your parcel ID here" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest px-1">Description</Label>
                                        <Textarea name="description" placeholder="Describe the land features, access, etc." className="min-h-[120px] rounded-2xl bg-muted/50 border-0 p-4" />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="h-14 rounded-2xl font-black px-12" disabled={createSale.isPending}>
                                            {createSale.isPending ? <Loader2 className="animate-spin mr-2" /> : "Publish Listing"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Listings Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] rounded-[3rem] bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : filteredSales?.length === 0 ? (
                    <div className="p-20 text-center bg-card rounded-[3rem] border-2 border-dashed border-border">
                        <LandPlot size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium italic">No land listings found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSales?.map((sale, idx) => (
                            <Card key={sale.id} className="group rounded-[3rem] border-border bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden relative animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                        <Button
                                            className="w-full rounded-2xl h-12 font-black gap-2 shadow-xl shadow-primary/40"
                                            onClick={() => setInquiryProperty(sale)}
                                        >
                                            <MessageSquare size={16} />
                                            Express Interest
                                        </Button>
                                    </div>
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <Badge className="bg-white/90 text-slate-900 border-0 backdrop-blur-md rounded-lg h-8 px-3 font-bold shadow-sm uppercase text-[10px] tracking-widest">
                                            {sale.land_parcels?.kebele || 'Haramaya'}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-6 right-6">
                                        <div className="bg-primary text-white p-3 rounded-2xl shadow-xl">
                                            <LandPlot size={20} />
                                        </div>
                                    </div>
                                    <img src={sale.images[0] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"} alt={sale.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{sale.title}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                                <Maximize2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Size</p>
                                                <p className="text-xs font-bold text-foreground">{sale.land_parcels?.area_sqm || 0} m²</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                <TrendingUp size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Value</p>
                                                <p className="text-xs font-bold text-foreground">High Growth</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="text-xs font-medium">{sale.land_parcels?.location || 'General Haramaya Area'}</span>
                                    </div>
                                    <div className="pt-6 border-t border-dashed flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Asking Price</p>
                                            <p className="text-2xl font-black text-foreground">ETB {sale.price.toLocaleString()}</p>
                                        </div>
                                        <Button variant="ghost" className="rounded-xl h-12 w-12 p-0 group-hover:bg-primary group-hover:text-white transition-all">
                                            <TrendingUp size={20} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Inquiry Dialog */}
                <Dialog open={!!inquiryProperty} onOpenChange={(open) => !open && setInquiryProperty(null)}>
                    <DialogContent className="rounded-[2.5rem] p-10 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Express Interest</DialogTitle>
                            <DialogDescription className="font-medium">
                                Sending an inquiry for "{inquiryProperty?.title}". A staff member or the seller will contact you.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="p-4 bg-muted/50 rounded-2xl flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <LandPlot size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black">{inquiryProperty?.title}</p>
                                    <p className="text-xs text-muted-foreground font-medium">ETB {inquiryProperty?.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest px-1">Your Message</Label>
                                <Textarea
                                    placeholder="I am interested in this land. Please provide more details about the title deed..."
                                    className="min-h-[150px] rounded-2xl bg-muted/50 border-0 p-6 font-medium text-sm"
                                    value={inquiryMessage}
                                    onChange={(e) => setInquiryMessage(e.target.value)}
                                />
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                                <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                                    Your contact information registered with HLMS will be shared with the relevant parties to facilitate the transaction.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20"
                                onClick={handleInquiry}
                                disabled={createInquiry.isPending}
                            >
                                {createInquiry.isPending ? <Loader2 className="animate-spin mr-2" /> : "Send Inquiry Now"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
