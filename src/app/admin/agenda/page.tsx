import type { Metadata } from "next";

import { AgendaListTable } from "@/components/admin/agenda-list-table";
import { getAllAgendaForAdmin } from "@/db/queries/agenda";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

export default async function AdminAgendaPage() {
  const items = await getAllAgendaForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AgendaListTable initialAgenda={items} />
    </div>
  );
}
