"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";

import { ArticleEditorToolbar } from "@/components/admin/article-editor-toolbar";
import { MediaGalleryDialog } from "@/components/admin/media-gallery-dialog";
import { LinkDialog } from "@/components/admin/link-dialog";
import { FootnoteDialog } from "@/components/admin/footnote-dialog";
import { FindReplaceDialog } from "@/components/admin/find-replace-dialog";
import { Callout, ArabicText, Footnote } from "@/lib/tiptap-extensions";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  content,
  onChange,
  className,
}: {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [footnoteDialogOpen, setFootnoteDialogOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Callout,
      ArabicText,
      Footnote,
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "article-content min-h-[24rem] rounded-b-xl border border-input px-3.5 py-3 outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const isFootnoteActive = Boolean(editor?.isActive("footnote"));
  const footnoteInitialText = isFootnoteActive
    ? (editor?.getAttributes("footnote").text as string) ?? ""
    : "";
  const linkInitialUrl = editor?.isActive("link")
    ? ((editor.getAttributes("link").href as string) ?? "")
    : "";

  return (
    <div className={className}>
      <ArticleEditorToolbar
        editor={editor}
        onImageClick={() => setGalleryOpen(true)}
        onLinkClick={() => setLinkDialogOpen(true)}
        onFootnoteClick={() => setFootnoteDialogOpen(true)}
        onFindReplaceClick={() => setFindReplaceOpen(true)}
      />
      <EditorContent editor={editor} />
      <MediaGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onInsert={({ src, alt }) => {
          editor?.chain().focus().setImage({ src, alt }).run();
        }}
      />
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        initialUrl={linkInitialUrl}
        onSubmit={(url) => {
          editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
        onRemove={() => {
          editor?.chain().focus().unsetLink().run();
        }}
      />
      <FootnoteDialog
        open={footnoteDialogOpen}
        onOpenChange={setFootnoteDialogOpen}
        initialText={footnoteInitialText}
        onSubmit={(text) => {
          if (isFootnoteActive) {
            editor?.chain().focus().updateAttributes("footnote", { text }).run();
          } else {
            editor?.chain().focus().insertFootnote({ text }).run();
          }
        }}
      />
      <FindReplaceDialog
        open={findReplaceOpen}
        onOpenChange={setFindReplaceOpen}
        editor={editor}
      />
    </div>
  );
}
