"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleImageUploadProps {
  value?: File[] | string[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
}

export function MultipleImageUpload({
  value = [],
  onChange,
  disabled,
  className,
  maxFiles = 10,
}: MultipleImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Check max files limit
    const currentFiles =
      Array.isArray(value) && value.length > 0 && value[0] instanceof File
        ? (value as File[])
        : [];
    const totalFiles = currentFiles.length + validFiles.length;

    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Add new files to existing ones
    const newFiles = [...currentFiles, ...validFiles];
    onChange(newFiles);

    // Create previews for new files
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const currentFiles =
      Array.isArray(value) && value.length > 0 && value[0] instanceof File
        ? (value as File[])
        : [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    onChange(newFiles);

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Get display images (either previews for new files or URLs for existing files)
  const getDisplayImages = () => {
    if (Array.isArray(value) && value.length > 0) {
      if (value[0] instanceof File) {
        return previews;
      } else {
        // Existing images (URLs)
        return (value as string[]).map((url) =>
          url.startsWith("/")
            ? `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
              }${url}`
            : url
        );
      }
    }
    return [];
  };

  const displayImages = getDisplayImages();
  const currentFiles =
    Array.isArray(value) && value.length > 0 && value[0] instanceof File
      ? (value as File[])
      : [];

  return (
    <div className={cn("space-y-4", className)}>
      <input
        title="multiple_image_upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Image Grid */}
      {displayImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={
                    process.env.NEXT_PUBLIC_ASSETS_URL + image ||
                    "/placeholder.svg"
                  }
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {displayImages.length === 0 && (
        <div
          onClick={handleClick}
          className={cn(
            "w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">Click to upload images</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB each</p>
          <p className="text-xs text-gray-400">Maximum {maxFiles} images</p>
        </div>
      )}

      {/* Add More Button */}
      {displayImages.length > 0 && currentFiles.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="w-full bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add More Images ({currentFiles.length}/{maxFiles})
        </Button>
      )}

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={disabled || currentFiles.length >= maxFiles}
        className="w-full bg-transparent"
      >
        <Upload className="h-4 w-4 mr-2" />
        {displayImages.length === 0 ? "Upload Images" : "Change Images"}
      </Button>
    </div>
  );
}
