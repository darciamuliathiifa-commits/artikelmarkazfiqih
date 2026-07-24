"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { SiteChromeData } from "@/lib/data/site";

export function SiteChrome({
  data,
  children,
}: {
  data: SiteChromeData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <SiteHeader
        categories={data.categories}
        kelasUrl={data.kelasUrl}
        tagline={data.footer.tagline}
      />
      <main key={pathname} className="page-transition flex-1">
        {children}
      </main>
      <SiteFooter footer={data.footer} />
    </>
  );
}
