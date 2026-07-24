import type { Metadata } from "next";

import { EbookListTable } from "@/components/admin/ebook-list-table";
import { getAllEbooksForAdmin } from "@/db/queries/ebooks";

export const metadata: Metadata = {
  title: "Kelola E-Book",
  robots: { index: false, follow: false },
};

export default async function AdminEbookListPage() {
  const items = await getAllEbooksForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <EbookListTable initialEbooks={items} />
    </div>
  );
}
