import type { Metadata } from "next";

import { getAllCommentsForAdmin } from "@/db/queries/comments";
import { CommentListTable } from "@/components/admin/comment-list-table";

export const metadata: Metadata = {
  title: "Komentar",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const comments = await getAllCommentsForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <CommentListTable initialComments={comments} />
    </div>
  );
}
