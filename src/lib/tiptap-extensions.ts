import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core";

export type CalloutVariant = "info" | "catatan" | "peringatan";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes: { variant: CalloutVariant }) => ReturnType;
    };
    arabicText: {
      setArabicText: () => ReturnType;
      unsetArabicText: () => ReturnType;
    };
    footnote: {
      insertFootnote: (attributes: { text: string }) => ReturnType;
    };
    blockDirection: {
      setBlockDirection: (direction: "rtl" | null) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (element) => element.getAttribute("data-variant") ?? "info",
        renderHTML: (attributes) => ({ "data-variant": attributes.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-callout": "" }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
    };
  },
});

export const ArabicText = Mark.create({
  name: "arabicText",

  parseHTML() {
    return [{ tag: 'span[dir="rtl"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        dir: "rtl",
        lang: "ar",
        class: "font-arabic",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setArabicText:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      unsetArabicText:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

export const Footnote = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-note") ?? "",
        renderHTML: (attributes) => ({ "data-note": attributes.text }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "sup[data-footnote]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "sup",
      mergeAttributes(HTMLAttributes, {
        "data-footnote": "",
        class: "footnote-ref",
      }),
      "note",
    ];
  },

  addCommands() {
    return {
      insertFootnote:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});

const DIRECTION_TYPES = ["paragraph", "heading", "blockquote", "listItem"];

// Arah teks per blok, seperti tombol "kiri ke kanan / kanan ke kiri" di Word.
// Hanya "rtl" yang disimpan; blok tanpa atribut dir dianggap kiri ke kanan.
export const BlockDirection = Extension.create({
  name: "blockDirection",

  addGlobalAttributes() {
    return [
      {
        types: DIRECTION_TYPES,
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("dir") === "rtl" ? "rtl" : null,
            renderHTML: (attributes) =>
              attributes.dir ? { dir: attributes.dir } : {},
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBlockDirection:
        (direction) =>
        ({ commands }) => {
          DIRECTION_TYPES.forEach((type) =>
            commands.updateAttributes(type, { dir: direction })
          );
          return true;
        },
    };
  },
});
