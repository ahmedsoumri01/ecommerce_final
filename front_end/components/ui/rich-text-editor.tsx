"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Enter description...",
  disabled,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg",
        isFocused && "ring-2 ring-ring ring-offset-2",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("bold")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("italic")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("underline")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertUnorderedList")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("insertOrderedList")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyLeft")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyCenter")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => executeCommand("justifyRight")}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[120px] p-3 outline-none",
          disabled && "opacity-50 cursor-not-allowed",
          "prose prose-sm max-w-none",
          "[&_ul]:list-disc [&_ul]:ml-6",
          "[&_ol]:list-decimal [&_ol]:ml-6",
          "[&_p]:mb-2 [&_p:last-child]:mb-0"
        )}
        data-placeholder={placeholder}
        style={{
          minHeight: "120px",
        }}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
