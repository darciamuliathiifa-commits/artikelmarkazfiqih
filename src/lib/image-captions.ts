/**
 * Menampilkan teks alt gambar sebagai keterangan di bawah gambar.
 *
 * Editor menyimpan deskripsi singkat gambar pada atribut `alt`, tetapi atribut
 * itu tidak pernah terlihat pembaca. Transformasi ini dijalankan saat render
 * (bukan saat simpan), jadi HTML yang tersimpan tetap berisi <img> polos.
 */
export function addImageCaptions(html: string): string {
  return html.replace(/<img\b([^>]*)>/g, (match, attrs: string) => {
    const alt = /\balt="([^"]*)"/.exec(attrs)?.[1]?.trim();
    if (!alt) return match;

    return `<figure>${match}<figcaption>${alt}</figcaption></figure>`;
  });
}
