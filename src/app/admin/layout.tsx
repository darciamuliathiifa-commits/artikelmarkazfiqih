import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminChrome } from "@/components/admin/admin-chrome";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");

  if (pathname !== "/admin/login") {
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || session.user.role !== "admin") {
      redirect(`/admin/login?redirect=${encodeURIComponent(pathname ?? "/admin")}`);
    }
  }

  return <AdminChrome>{children}</AdminChrome>;
}
