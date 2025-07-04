"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/stores/product-store";
interface ProductGalleryProps {
  images: string[];
  productName: string;
  product: Product;

  locale: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ensure we have at least one image
  const galleryImages =
    images && images.length > 0 ? images : ["/placeholder.svg"];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <>
      <div className="space-y-4 ">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
          <div
            className="relative w-full h-full cursor-zoom-in flex"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL +
                  galleryImages[selectedImage] || "/placeholder.svg"
              }
              alt={productName}
              fill
              className={`object-cover transition-transform duration-300  ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
            />
          </div>

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                title="Previous image"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                title="Next image"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {galleryImages.map((image, index) => (
              <button
                title={`View image ${index + 1}`}
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden transition-colors ${
                  index === selectedImage
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSETS_URL + image ||
                    "/placeholder.svg"
                  }
                  alt={`${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
