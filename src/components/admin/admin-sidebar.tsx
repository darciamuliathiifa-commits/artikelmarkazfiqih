"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  MessagesSquare,
  Inbox,
  Users,
  FileText,
  Link2,
  Menu,
  ExternalLink,
  LogOut,
  MessageSquare,
  Calendar,
  Camera,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth-client";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Artikel", href: "/admin/artikel", icon: Newspaper },
  { label: "Tanya Jawab", href: "/admin/tanya-jawab", icon: MessagesSquare },
  { label: "Pertanyaan Masuk", href: "/admin/pertanyaan", icon: Inbox },
  { label: "Agenda", href: "/admin/agenda", icon: Calendar },
  { label: "Kegiatan", href: "/admin/kegiatan", icon: Camera },
  { label: "E-Book", href: "/admin/ebook", icon: BookOpen },
  { label: "Komentar", href: "/admin/komentar", icon: MessageSquare },
  { label: "Kontributor", href: "/admin/kontributor", icon: Users },
  { label: "Halaman Statis", href: "/admin/halaman-statis", icon: FileText },
  { label: "Tautan Eksternal", href: "/admin/tautan-eksternal", icon: Link2 },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isItemActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountFooter() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
      {session?.user && (
        <p className="truncate px-3 text-xs text-muted-foreground">
          Masuk sebagai <span className="font-medium">{session.user.name}</span>
        </p>
      )}
      <Link
        href="/"
        className="flex items-center gap-1.5 px-3 text-xs text-muted-foreground hover:text-primary"
      >
        Lihat situs
        <ExternalLink className="size-3" />
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-1.5 px-3 text-left text-xs text-muted-foreground hover:text-destructive"
      >
        <LogOut className="size-3" />
        Keluar
      </button>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-border p-4 lg:block">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-1">
          <Logo height={28} />
          <span className="text-xs font-semibold text-muted-foreground">
            Panel Admin
          </span>
        </Link>
        <NavLinks pathname={pathname} />
        <AccountFooter />
      </aside>

      <div className="flex items-center justify-between border-b border-border p-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo height={26} />
          <span className="text-xs font-semibold text-muted-foreground">
            Panel Admin
          </span>
        </Link>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label="Buka menu admin" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Panel Admin</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <NavLinks pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              <AccountFooter />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
