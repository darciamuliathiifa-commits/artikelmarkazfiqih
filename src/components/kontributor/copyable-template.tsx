"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyableTemplate({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bisa ditolak browser (misal bukan HTTPS); teks tetap bisa diblok manual.
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Salin teks"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Salin
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 py-4 font-sans text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    </div>
  );
}
