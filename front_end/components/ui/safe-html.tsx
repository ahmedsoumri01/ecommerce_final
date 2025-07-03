"use client";

import { cn } from "@/lib/utils";
import type { JSX } from "react";

interface SafeHtmlProps {
  content: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Alternative lightweight component for rendering HTML without external dependencies
 * Use this if you don't want to add DOMPurify dependency
 */
export function SafeHtml({
  content,
  className,
  as: Component = "div",
}: SafeHtmlProps) {
  // Basic HTML sanitization - removes script tags and dangerous attributes
  const sanitizeHtml = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/data:/gi, "");
  };

  const sanitizedContent = sanitizeHtml(content);

  return (
    <Component
      className={cn(
        // Base prose styles
        "prose prose-sm max-w-none",
        // Typography
        "text-gray-700 leading-relaxed",
        // Headings
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
        "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4",
        // Paragraphs and divs
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_div]:mb-2 [&_div:last-child]:mb-0",
        // Text formatting
        "[&_strong]:font-bold [&_b]:font-bold",
        "[&_em]:italic [&_i]:italic",
        "[&_u]:underline",
        // Lists
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3 [&_ol]:space-y-1",
        "[&_li]:leading-relaxed",
        // Nested lists
        "[&_ul_ul]:mt-2 [&_ul_ul]:mb-2",
        "[&_ol_ol]:mt-2 [&_ol_ol]:mb-2",
        "[&_ul_ul]:list-[circle]",
        "[&_ul_ul_ul]:list-[square]",
        // RTL support
        "rtl:text-right rtl:[&_ul]:mr-6 rtl:[&_ul]:ml-0 rtl:[&_ol]:mr-6 rtl:[&_ol]:ml-0",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
