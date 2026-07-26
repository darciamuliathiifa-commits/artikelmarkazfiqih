"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ImagePlus,
  Link as LinkIcon,
  Minus,
  Info,
  StickyNote,
  AlertTriangle,
  Superscript,
  Languages,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SearchCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CalloutVariant } from "@/lib/tiptap-extensions";

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(active && "bg-muted text-foreground")}
    >
      {children}
    </Button>
  );
}

export function ArticleEditorToolbar({
  editor,
  onImageClick,
  onLinkClick,
  onFootnoteClick,
  onFindReplaceClick,
}: {
  editor: Editor | null;
  onImageClick?: () => void;
  onLinkClick?: () => void;
  onFootnoteClick?: () => void;
  onFindReplaceClick?: () => void;
}) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((n) => n + 1);
    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);
    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  if (!editor) return null;

  const state = {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    strike: editor.isActive("strike"),
    heading2: editor.isActive("heading", { level: 2 }),
    heading3: editor.isActive("heading", { level: 3 }),
    bulletList: editor.isActive("bulletList"),
    orderedList: editor.isActive("orderedList"),
    blockquote: editor.isActive("blockquote"),
    link: editor.isActive("link"),
    arabicText: editor.isActive("arabicText"),
    alignLeft: editor.isActive({ textAlign: "left" }),
    alignCenter: editor.isActive({ textAlign: "center" }),
    alignRight: editor.isActive({ textAlign: "right" }),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
  };

  const setCallout = (variant: CalloutVariant) => {
    editor.chain().focus().setCallout({ variant }).run();
  };

  const toggleArabicText = () => {
    if (state.arabicText) {
      editor.chain().focus().unsetArabicText().run();
    } else {
      editor.chain().focus().setArabicText().run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-xl border border-b-0 border-input bg-muted/30 p-1.5">
      <ToolbarButton
        label="Tebal"
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Miring"
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Coret"
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton
        label="Judul Bagian"
        active={state.heading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Sub Judul"
        active={state.heading3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton
        label="Daftar Poin"
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar Bernomor"
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Kutipan"
        active={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Garis Pemisah"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton
        label="Rata Kiri"
        active={state.alignLeft}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rata Tengah"
        active={state.alignCenter}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Rata Kanan"
        active={state.alignRight}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {onLinkClick && (
        <ToolbarButton label="Sisipkan Link" active={state.link} onClick={onLinkClick}>
          <LinkIcon className="size-4" />
        </ToolbarButton>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Sisipkan Callout Box"
            />
          }
        >
          <Info className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setCallout("info")}>
            <Info className="size-4" />
            Info
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCallout("catatan")}>
            <StickyNote className="size-4" />
            Catatan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCallout("peringatan")}>
            <AlertTriangle className="size-4" />
            Peringatan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {onFootnoteClick && (
        <ToolbarButton label="Catatan Kaki" onClick={onFootnoteClick}>
          <Superscript className="size-4" />
        </ToolbarButton>
      )}

      <ToolbarButton
        label="Teks Arab (RTL)"
        active={state.arabicText}
        onClick={toggleArabicText}
      >
        <Languages className="size-4" />
      </ToolbarButton>

      {onImageClick && (
        <ToolbarButton label="Sisipkan Gambar" onClick={onImageClick}>
          <ImagePlus className="size-4" />
        </ToolbarButton>
      )}

      <Separator orientation="vertical" className="mx-1 h-5" />

      {onFindReplaceClick && (
        <ToolbarButton label="Cari & Ganti" onClick={onFindReplaceClick}>
          <SearchCode className="size-4" />
        </ToolbarButton>
      )}

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton
        label="Urungkan"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ulangi"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}
