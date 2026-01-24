import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StructureImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export function StructureImageUpload({
    images,
    onChange,
    maxImages = 10,
    disabled = false,
}: StructureImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (disabled) return;

            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        },
        [disabled, images, maxImages, onChange]
    );

    const handleFiles = (files: File[]) => {
        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/")
        );

        if (images.length + imageFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Convert files to data URLs for preview
        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                onChange([...images, dataUrl]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="structure-image-upload"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    disabled={disabled || images.length >= maxImages}
                />
                <label
                    htmlFor="structure-image-upload"
                    className={cn(
                        "cursor-pointer",
                        disabled && "cursor-not-allowed"
                    )}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">
                                Upload Structure Images
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {images.length} / {maxImages} images uploaded
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                        >
                            <img
                                src={image}
                                alt={`Structure ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {!disabled && (
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-xs text-white">Image {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images uploaded yet</p>
                    <p className="text-xs">
                        Upload photos of the building, house, or apartment
                    </p>
                </div>
            )}
        </div>
    );
}
