import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    MapPin,
    Eye,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCitizenParcels } from "@/hooks/useCitizenData";

export default function CitizenProperties() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedParcel, setSelectedParcel] = useState<any>(null);
    const { data: parcels, isLoading: parcelsLoading } = useCitizenParcels();

    const filteredParcels = parcels?.filter((p: any) =>
        p.parcel_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <MainLayout
            title="My Properties"
            subtitle="Manage and view details of your registered land parcels"
        >
            <div className="space-y-6">
                {/* Search and Filter Strip */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Parcel ID or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground px-4">
                        Total: <span className="font-bold text-foreground">{parcels?.length || 0}</span> Parcels
                    </div>
                </div>

                {/* Properties Grid */}
                {parcelsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-64 rounded-3xl" />
                        ))}
                    </div>
                ) : filteredParcels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredParcels.map((parcel: any, index: number) => {
                            const latestValuation = parcel.property_valuations?.find((v: any) => v.is_current);
                            return (
                                <Card
                                    key={parcel.id}
                                    className="group overflow-hidden rounded-[2rem] border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500 animate-slide-up bg-card"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="h-32 bg-muted relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                                        <div className="absolute top-4 right-4">
                                            <Badge
                                                className={cn(
                                                    "capitalize px-3 py-1 rounded-full text-[10px] font-bold tracking-widest",
                                                    parcel.status === "registered" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                                    parcel.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                                    parcel.status === "disputed" && "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                                )}
                                            >
                                                {parcel.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute -bottom-6 left-6">
                                            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <MapPin className="w-8 h-8 text-primary/40" />
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="pt-10 p-6">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{parcel.parcel_id}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin size={12} />
                                                {parcel.kebele || "Haramaya Sub-city"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-t border-border pt-4">
                                            <div>
                                                <span className="text-muted-foreground uppercase tracking-tighter">Size</span>
                                                <p className="font-bold text-sm text-foreground">{parcel.area_sqm?.toLocaleString()} m²</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground uppercase tracking-tighter">Land Use</span>
                                                <p className="font-bold text-sm text-foreground capitalize">{parcel.land_use}</p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all gap-2"
                                            onClick={() => setSelectedParcel(parcel)}
                                        >
                                            <Eye size={16} />
                                            View Full Asset Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border mt-12">
                        <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h3 className="text-xl font-bold text-foreground">No properties found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any land records matching your search criteria. Try a different Parcel ID or keyword.</p>
                    </div>
                )}
            </div>

            {/* Detailed View Dialog */}
            <Dialog open={!!selectedParcel} onOpenChange={() => setSelectedParcel(null)}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-border bg-card">
                    {selectedParcel && (
                        <div className="flex flex-col">
                            <div className="h-48 bg-primary/5 p-8 flex items-end justify-between border-b border-border">
                                <div>
                                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest">{selectedParcel.status}</Badge>
                                    <h2 className="text-3xl font-extrabold text-foreground">{selectedParcel.parcel_id}</h2>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <MapPin size={16} />
                                        {selectedParcel.location || "General Area, Haramaya Wereda"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Asset Value</span>
                                    <p className="text-2xl font-black text-primary">
                                        ETB {selectedParcel.property_valuations?.[0]?.assessed_value?.toLocaleString() || "---"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Land Use Type</p>
                                    <p className="font-bold capitalize text-foreground">{selectedParcel.land_use}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Land Grade</p>
                                    <p className="font-bold text-foreground">Grade {selectedParcel.land_grade || "A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Surface Area</p>
                                    <p className="font-bold text-foreground">{selectedParcel.area_sqm?.toLocaleString()} Square Meters</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Zone / Kebele</p>
                                    <p className="font-bold text-foreground">{selectedParcel.kebele || "Maya Laman"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Reg. Date</p>
                                    <p className="font-bold text-foreground">{selectedParcel.registration_date || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Parcel Class</p>
                                    <p className="font-bold text-foreground">Standard</p>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-8 pt-0 flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">GIS Coordinates</h4>
                                        <p className="text-xs text-muted-foreground">Lat: 9.3957, Long: 42.0158 (Verified)</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto text-primary text-xs font-bold">Open Map</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
