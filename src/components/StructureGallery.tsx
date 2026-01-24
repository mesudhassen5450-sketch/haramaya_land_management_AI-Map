import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StructureGalleryProps {
    images: string[];
    title?: string;
}

export function StructureGallery({ images, title = "Structure Images" }: StructureGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);

    if (images.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No images available</p>
            </div>
        );
    }

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setZoom(1);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
        setZoom(1);
    };

    const goToPrevious = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
            setZoom(1);
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
            setZoom(1);
        }
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.5, 1));
    };

    return (
        <>
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted hover:border-primary transition-all"
                    >
                        <img
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-white">Click to view</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
                <DialogContent className="max-w-4xl h-[90vh] p-0">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>
                            {title} - Image {selectedIndex !== null ? selectedIndex + 1 : 0} of {images.length}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative flex-1 flex items-center justify-center bg-black/5 p-4">
                        {selectedIndex !== null && (
                            <>
                                {/* Main Image */}
                                <div className="relative max-w-full max-h-full overflow-auto">
                                    <img
                                        src={images[selectedIndex]}
                                        alt={`${title} ${selectedIndex + 1}`}
                                        className="max-w-full max-h-full object-contain transition-transform"
                                        style={{ transform: `scale(${zoom})` }}
                                    />
                                </div>

                                {/* Navigation Buttons */}
                                {images.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                                            onClick={goToPrevious}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                                            onClick={goToNext}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </>
                                )}

                                {/* Zoom Controls */}
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-background/80 backdrop-blur"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= 1}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-background/80 backdrop-blur"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= 3}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Close Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-4 right-4 bg-background/80 backdrop-blur"
                                    onClick={closeLightbox}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedIndex(index);
                                            setZoom(1);
                                        }}
                                        className={cn(
                                            "flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all",
                                            selectedIndex === index
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
