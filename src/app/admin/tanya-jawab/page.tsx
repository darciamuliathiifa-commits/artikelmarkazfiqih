import type { Metadata } from "next";

import { QnaListTable } from "@/components/admin/qna-list-table";
import { getAllQnaForAdmin } from "@/db/queries/qna";

export const metadata: Metadata = {
  title: "Kelola Tanya Jawab",
  robots: { index: false, follow: false },
};

export default async function AdminQnaListPage() {
  const items = await getAllQnaForAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <QnaListTable initialQna={items} />
    </div>
  );
}
