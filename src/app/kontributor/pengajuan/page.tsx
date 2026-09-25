import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArticleSidebar } from "@/components/home/sidebar/article-sidebar";
import { CopyableTemplate } from "@/components/kontributor/copyable-template";

const SUBMISSION_EMAIL = "contactmarkazfiqih@gmail.com";
const SUBMISSION_SUBJECT =
  "Pengajuan Kontributor – [Nama Penulis] – [Judul Tulisan]";
const SUBMISSION_TEMPLATE = `Assalamu’alaikum warahmatullahi wabarakatuh.

Saya bermaksud mengajukan tulisan untuk menjadi kontributor Markaz Fiqih.

Data Penulis
Nama lengkap:
Nama untuk byline:
No. WhatsApp:
Alamat:
No. rekening:
Nama pemilik rekening:
Profil singkat (1–2 kalimat):
Profil lengkap (pendidikan, pengalaman, bidang keilmuan, dan karya yang relevan):
Judul tulisan:
Topik/bidang:

Lampiran:
- File tulisan (.docx)
- Foto penulis

Demikian pengajuan ini saya sampaikan. Saya siap mengikuti proses kurasi dan penyuntingan yang dilakukan oleh redaksi Markaz Fiqih.

Terima kasih atas perhatian dan waktunya.

Wassalamu’alaikum warahmatullahi wabarakatuh.`;

export const metadata: Metadata = {
  title: "Pengajuan Kontributor",
  description:
    "Ketentuan tulisan, cara pengajuan, dan proses editorial untuk berkontribusi menulis di Markaz Fiqih.",
};

export default function ContributorSubmissionPage() {
  const mailtoHref = `mailto:${SUBMISSION_EMAIL}?subject=${encodeURIComponent(
    SUBMISSION_SUBJECT
  )}&body=${encodeURIComponent(SUBMISSION_TEMPLATE)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Pengajuan Kontributor Markaz Fiqih
          </h1>

          <div className="article-content mt-6">
            <p>Ingin berkontribusi dalam menyebarkan tulisan di Markaz Fiqih?</p>
            <p>
              Markaz Fiqih membuka kesempatan bagi siapa saja yang memiliki
              kompetensi dan ketertarikan dalam bidang fiqih, ushul fiqih, dan
              kajian keislaman untuk berkontribusi melalui tulisan.
            </p>

            <h2>Ketentuan Tulisan</h2>
            <ul>
              <li>Karya sendiri dan bukan plagiarisme.</li>
              <li>Bereferensi.</li>
              <li>
                Menggunakan bahasa Indonesia yang baik, jelas, dan mudah
                dipahami.
              </li>
              <li>
                Menghindari clickbait, provokasi, dan pembahasan yang minim
                substansi.
              </li>
              <li>
                Setiap dalil dan kutipan ulama telah diverifikasi kepada sumber
                aslinya.
              </li>
              <li>
                AI boleh digunakan hanya sebagai alat bantu, bukan mengganti
                peran penulis.
              </li>
            </ul>

            <h2>Cara Mengajukan Tulisan</h2>
            <p>
              Kirimkan pengajuan ke{" "}
              <a href={`mailto:${SUBMISSION_EMAIL}`}>{SUBMISSION_EMAIL}</a>{" "}
              dengan subjek:
            </p>
            <p>
              <strong>{SUBMISSION_SUBJECT}</strong>
            </p>
            <p>Sertakan:</p>
            <ol>
              <li>Nama penulis untuk byline.</li>
              <li>
                Profil singkat (1-2 kalimat) untuk ditampilkan bersama artikel.
              </li>
              <li>
                Profil lengkap untuk kebutuhan internal redaksi, meliputi
                pendidikan, pengalaman, bidang keilmuan, dan karya yang relevan.
              </li>
              <li>
                Kontak penulis: nama, nomor telepon, alamat, dan nomor
                rekening.
              </li>
              <li>Foto penulis yang layak digunakan.</li>
              <li>File tulisan dalam format Word (.docx).</li>
            </ol>
            <p>
              <em>Nomor 2-4 cukup dikirim pada pengajuan pertama.</em>
            </p>
            <p>
              Agar lebih mudah, salin format email berikut, lalu lengkapi
              datanya:
            </p>
          </div>

          <div className="mt-4">
            <CopyableTemplate
              label="Format email pengajuan"
              text={SUBMISSION_TEMPLATE}
            />
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button size="lg" render={<a href={mailtoHref} />}>
              Ajukan Tulisan Anda
            </Button>
            <a
              href={mailtoHref}
              className="text-sm font-medium text-primary hover:underline"
            >
              {SUBMISSION_EMAIL}
            </a>
          </div>

          <div className="article-content mt-10">

            <h2>Proses Editorial</h2>
            <p>Redaksi akan melakukan peninjauan. Tulisan dapat:</p>
            <ul>
              <li>diterima untuk diterbitkan;</li>
              <li>dikembalikan untuk diperbaiki; atau</li>
              <li>
                belum dapat diterbitkan apabila belum memenuhi standar Markaz
                Fiqih.
              </li>
            </ul>
            <p>
              Redaksi dapat menyunting bahasa, struktur, format, dan SEO.
              Perubahan yang menyangkut substansi fiqih akan dikonfirmasikan
              kepada penulis.
            </p>
            <p>Hasil kurasi awal ditargetkan dalam 7-30 hari kerja.</p>

            <h2>Hak dan Apresiasi</h2>
            <ul>
              <li>
                Artikel dapat dipublikasikan dengan mencantumkan nama penulis di
                website dan media sosial Markaz Fiqih.
              </li>
              <li>
                Kontributor memperoleh kesempatan mendapatkan profil publikasi
                dan exposure.
              </li>
              <li>
                Kontributor yang konsisten berkesempatan memperoleh kolaborasi
                lanjutan, seperti menjadi pemateri atau narasumber.
              </li>
              <li>
                Untuk saat ini, kontribusi bersifat sukarela dan belum
                mendapatkan fee.
              </li>
            </ul>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <Link
              href="/kontributor"
              className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Lihat daftar kontributor
            </Link>
          </div>
        </div>

        <ArticleSidebar />
      </div>
    </div>
  );
}
