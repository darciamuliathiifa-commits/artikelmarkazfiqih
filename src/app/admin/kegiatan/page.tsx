import type { Metadata } from "next";

import { KegiatanListTable } from "@/components/admin/kegiatan-list-table";
import { getAllKegiatanForAdmin } from "@/db/queries/kegiatan";

export const metadata: Metadata = {
  title: "Kelola Kegiatan",
  robots: { index: false, follow: false },
};

export default async function AdminKegiatanListPage() {
  const items = await getAllKegiatanForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <KegiatanListTable initialKegiatan={items} />
    </div>
  );
}
