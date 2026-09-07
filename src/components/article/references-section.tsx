/**
 * Kolom referensi di akhir artikel dan tanya jawab.
 * Langsung tampil tanpa perlu diklik, dan hilang sendiri kalau kosong.
 */
export function ReferencesSection({ html }: { html: string }) {
  if (!html.trim()) return null;

  return (
    <section className="mt-10 rounded-xl border border-border bg-muted/30 px-5 py-4">
      <h2 className="font-heading text-base font-bold text-foreground">
        Referensi
      </h2>
      <div
        className="article-content mt-2 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
