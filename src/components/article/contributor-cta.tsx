import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContributorCta() {
  return (
    <div className="mt-6 flex flex-col gap-1 rounded-xl border border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="font-heading text-base font-bold text-foreground">
        Ingin jadi kontributor kami?
      </p>
      <Link
        href="/kontributor/pengajuan"
        className="flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Klik di sini
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
