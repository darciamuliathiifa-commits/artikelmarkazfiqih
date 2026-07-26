import type { Metadata } from "next";

import { getAllContributors } from "@/db/queries/authors";
import { ContributorListTable } from "@/components/admin/contributor-list-table";

export const metadata: Metadata = {
  title: "Kelola Kontributor",
  robots: { index: false, follow: false },
};

export default async function AdminContributorListPage() {
  const contributors = await getAllContributors(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <ContributorListTable initialContributors={contributors} />
    </div>
  );
}
