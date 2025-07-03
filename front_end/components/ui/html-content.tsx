"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className }: HtmlContentProps) {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "div",
      "span",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
      "code",
    ],
    ALLOWED_ATTR: ["style", "class"],
    ALLOWED_STYLES: {
      "*": {
        color: [/^#[0-9a-f]{3,6}$/i, /^rgb\(/i, /^rgba\(/i],
        "background-color": [/^#[0-9a-f]{3,6}$/i, /^rgb\(/i, /^rgba\(/i],
        "font-weight": [/^(normal|bold|bolder|lighter|[1-9]00)$/],
        "font-style": [/^(normal|italic|oblique)$/],
        "text-decoration": [/^(none|underline|overline|line-through)$/],
        "text-align": [/^(left|right|center|justify)$/],
        "font-size": [/^[0-9]+(px|em|rem|%)$/],
        "line-height": [/^[0-9.]+$/],
        margin: [/^[0-9]+(px|em|rem|%)( [0-9]+(px|em|rem|%))*$/],
        padding: [/^[0-9]+(px|em|rem|%)( [0-9]+(px|em|rem|%))*$/],
      },
    },
  });

  return (
    <div
      className={cn(
        // Base prose styles
        "prose prose-sm max-w-none",
        // Typography
        "text-gray-700 leading-relaxed",
        // Headings
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
        "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4",
        "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3",
        // Paragraphs
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_div]:mb-2 [&_div:last-child]:mb-0",
        // Text formatting
        "[&_strong]:font-bold [&_b]:font-bold",
        "[&_em]:italic [&_i]:italic",
        "[&_u]:underline",
        // Lists
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3",
        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3",
        "[&_li]:mb-1 [&_li]:leading-relaxed",
        "[&_ul_ul]:mt-1 [&_ol_ol]:mt-1",
        "[&_ul_ol]:mt-1 [&_ol_ul]:mt-1",
        // Nested lists
        "[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square]",
        // Blockquotes
        "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
        // Code
        "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
        "[&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-3",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // Line breaks
        "[&_br]:block [&_br]:content-[''] [&_br]:mt-2",
        // RTL support
        "rtl:text-right rtl:[&_ul]:mr-6 rtl:[&_ul]:ml-0 rtl:[&_ol]:mr-6 rtl:[&_ol]:ml-0",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
