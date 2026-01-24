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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Home,
    MapPin,
    Search,
    Filter,
    Plus,
    MessageSquare,
    AlertCircle,
    Loader2,
    BedDouble,
    Bath,
    Maximize
} from "lucide-react";
import { usePropertySales, useCreatePropertySale } from "@/hooks/usePropertySales";
import { useCreateInquiry } from "@/hooks/useInquiries";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function HouseSales() {
    const { profile } = useAuth();
    const { data: sales, isLoading } = usePropertySales('house');
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
        const newSale = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            listing_type: 'house' as const,
            parcel_id: formData.get("parcel_id") as string,
            seller_id: profile?.id,
            status: 'available' as const,
        };

        try {
            await createSale.mutateAsync(newSale);
            setIsCreateOpen(false);
        } catch (err) { }
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
                category: 'house_sale'
            });
            setInquiryProperty(null);
            setInquiryMessage("");
        } catch (err) { }
    };

    return (
        <MainLayout
            title="Residential Housing"
            subtitle="Find your next home in the heart of Haramaya"
        >
            <div className="space-y-8 animate-fade-in">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by neighborhood or features..."
                            className="pl-11 h-12 rounded-2xl bg-card border-border shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold px-6">
                            <Filter size={18} />
                            Filter Results
                        </Button>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-12 rounded-2xl gap-2 font-black px-8 shadow-xl shadow-primary/20">
                                    <Plus size={18} />
                                    Post Your House
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl rounded-[2.5rem] p-10">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Sell Your Property</DialogTitle>
                                    <DialogDescription className="font-medium">
                                        List your residential property for sale on the HLMS marketplace.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateSale} className="space-y-6 py-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest px-1">House Title</Label>
                                            <Input name="title" placeholder="e.g. Modern 3-Bedroom Villa" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest px-1">Asking Price (ETB)</Label>
                                            <Input name="price" type="number" placeholder="2,500,000" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest px-1">Land Parcel ID</Label>
                                        <Input name="parcel_id" placeholder="Associated parcel UUID" required className="h-14 rounded-2xl bg-muted/50 border-0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest px-1">Detailed Description</Label>
                                        <Textarea name="description" placeholder="Include details about bedrooms, bathrooms, and unique features." className="min-h-[120px] rounded-2xl bg-muted/50 border-0 p-4" />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="h-14 rounded-2xl font-black px-12" disabled={createSale.isPending}>
                                            {createSale.isPending ? <Loader2 className="animate-spin mr-2" /> : "Post Listing Now"}
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
                        <Home size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium italic">No houses currently listed for sale.</p>
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
                                            Request Tour
                                        </Button>
                                    </div>
                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-primary/90 text-white border-0 backdrop-blur-md rounded-lg h-8 px-3 font-bold shadow-sm uppercase text-[10px] tracking-widest">
                                            Featured
                                        </Badge>
                                    </div>
                                    <img src={sale.images[0] || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"} alt={sale.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">{sale.title}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="text-xs font-medium">{sale.land_parcels?.location || 'Resident neighborhood, Haramaya'}</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-8 py-4 border-y border-dashed">
                                        <div className="flex flex-col items-center gap-1">
                                            <BedDouble size={18} className="text-muted-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">3 Beds</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-x border-dashed px-6">
                                            <Bath size={18} className="text-muted-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">2 Baths</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Maximize size={18} className="text-muted-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">120m²</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Investment</p>
                                            <p className="text-2xl font-black text-foreground">ETB {sale.price.toLocaleString()}</p>
                                        </div>
                                        <Button variant="secondary" className="rounded-xl h-12 font-black px-4 bg-muted hover:bg-primary hover:text-white transition-all">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Inquiry Dialog (Same as PropertySales) */}
                <Dialog open={!!inquiryProperty} onOpenChange={(open) => !open && setInquiryProperty(null)}>
                    <DialogContent className="rounded-[2.5rem] p-10 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Request Visit</DialogTitle>
                            <DialogDescription className="font-medium">
                                Sending a formal request for "{inquiryProperty?.title}".
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="p-4 bg-muted/50 rounded-2xl flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black">{inquiryProperty?.title}</p>
                                    <p className="text-xs text-muted-foreground font-medium">ETB {inquiryProperty?.price.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest px-1">Message for Seller</Label>
                                <Textarea
                                    placeholder="I would like to schedule a tour next Tuesday. Is the house available for viewing?..."
                                    className="min-h-[150px] rounded-2xl bg-muted/50 border-0 p-6 font-medium text-sm"
                                    value={inquiryMessage}
                                    onChange={(e) => setInquiryMessage(e.target.value)}
                                />
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
                                <AlertCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                                    Verified sellers will respond to your inquiry via HLMS or your registered phone number.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                                onClick={handleInquiry}
                                disabled={createInquiry.isPending}
                            >
                                {createInquiry.isPending ? <Loader2 className="animate-spin mr-2" /> : "Request Tour Now"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
