"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const { toast } = useToast();

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
    navigator.clipboard.writeText(`${title} - ${url}`);
    toast({
      title: "تم نسخ الرابط! 📋",
      description: "يمكنك الآن لصقه في Instagram",
      duration: 3000,
    });
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      toast({
        title: "تم نسخ الرابط! 📋",
        description: "يمكنك مشاركته الآن",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="icon"
        className="text-blue-600 hover:bg-blue-50 bg-transparent"
        onClick={shareOnFacebook}
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-blue-400 hover:bg-blue-50 bg-transparent"
        onClick={shareOnTwitter}
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-pink-600 hover:bg-pink-50 bg-transparent"
        onClick={shareOnInstagram}
      >
        <Instagram className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-gray-600 hover:bg-gray-50 bg-transparent"
        onClick={shareNative}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
