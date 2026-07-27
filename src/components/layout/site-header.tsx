"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ChevronDown, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/search/global-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Tanya Jawab", href: "/tanya-jawab" },
  { label: "Kirim Pertanyaan", href: "/kirim-pertanyaan" },
  { label: "Kontributor", href: "/kontributor" },
  { label: "Tentang", href: "/tentang-kami" },
];

const navLinkClass = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "bg-primary text-primary-foreground"
      : "text-foreground/80 hover:bg-muted hover:text-primary"
  }`;

export function SiteHeader({
  categories,
  kelasUrl,
  tagline,
}: {
  categories: { name: string; slug: string }[];
  kelasUrl: string;
  tagline: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  const isArtikelActive = pathname.startsWith("/artikel");
  const isTanyaJawabActive = pathname.startsWith("/tanya-jawab");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
      <div>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          {/* Left: Hamburger Menu & Logo Group */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Buka menu"
                    className="shrink-0"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96">
                <SheetHeader className="border-b pb-3">
                  <SheetTitle className="flex items-center gap-2.5">
                    <Logo emblem height={28} />
                    <div className="flex flex-col text-left">
                      <span className="font-heading text-sm font-bold leading-tight text-foreground">Markaz Fiqih</span>
                      <span className="text-[10px] font-normal leading-tight text-muted-foreground">{tagline}</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4">
                  <GlobalSearch onNavigate={() => setSheetOpen(false)} placeholder="Cari..." />

                  <nav className="flex flex-col gap-1">
                    {mainLinks.slice(0, 1).map((link) => (
                      <SheetClose
                        key={link.href}
                        nativeButton={false}
                        render={<Link href={link.href} />}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                      >
                        {link.label}
                      </SheetClose>
                    ))}

                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Artikel
                    </div>
                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/artikel" />}
                      className="rounded-lg px-5 py-1.5 text-sm hover:bg-muted"
                    >
                      Semua Artikel
                    </SheetClose>
                    {categories.map((category) => (
                      <SheetClose
                        key={category.slug}
                        nativeButton={false}
                        render={<Link href={`/artikel/kategori/${category.slug}`} />}
                        className="rounded-lg px-5 py-1.5 text-sm hover:bg-muted"
                      >
                        {category.name}
                      </SheetClose>
                    ))}

                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/tanya-jawab" />}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      Tanya Jawab
                    </SheetClose>

                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/agenda" />}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      Agenda
                    </SheetClose>

                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/kegiatan" />}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      Kegiatan
                    </SheetClose>

                    <a
                      href={kelasUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      Kelas
                      <ExternalLink className="size-3" />
                    </a>

                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/e-book" />}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      E-Book
                    </SheetClose>

                    {mainLinks.slice(2).map((link) => (
                      <SheetClose
                        key={link.href}
                        nativeButton={false}
                        render={<Link href={link.href} />}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                      >
                        {link.label}
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile View: Navbar Mobile Markaz Image linking to Home */}
            <Link href="/" className="flex shrink-0 items-center sm:hidden" aria-label="Home">
              <Logo mobile height={26} priority className="h-6.5 w-auto max-w-[180px] object-contain" />
            </Link>

            {/* Desktop View: Emblem Logo + Text & Tagline linking to Home */}
            <Link href="/" className="hidden shrink-0 items-center gap-2.5 sm:flex" aria-label="Home">
              <Logo emblem height={30} priority />
              <div className="border-l border-border pl-2.5 flex flex-col justify-center text-left">
                <p className="font-heading text-sm font-bold leading-tight text-foreground">
                  Markaz Fiqih
                </p>
                <p className="text-[11px] leading-tight text-muted-foreground hidden md:block">
                  {tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Search & Theme Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <GlobalSearch
              className="w-32 xs:w-40 sm:w-48 md:w-64"
              placeholder="Cari..."
            />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="hidden border-t border-border bg-secondary/40 lg:block">
        <nav className="mx-auto flex h-11 max-w-5xl items-center gap-1 px-4">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className={`flex items-center gap-1 ${navLinkClass(isArtikelActive)}`}
                />
              }
            >
              Artikel
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem render={<Link href="/artikel" />}>
                Semua Artikel
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.slug}
                  render={<Link href={`/artikel/kategori/${category.slug}`} />}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/tanya-jawab" className={navLinkClass(isTanyaJawabActive)}>
            Tanya Jawab
          </Link>

          <Link
            href="/agenda"
            className={navLinkClass(pathname.startsWith("/agenda"))}
          >
            Agenda
          </Link>

          <Link
            href="/kegiatan"
            className={navLinkClass(pathname.startsWith("/kegiatan"))}
          >
            Kegiatan
          </Link>

          <a
            href={kelasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary"
          >
            Kelas
            <ExternalLink className="size-3" />
          </a>

          <Link href="/e-book" className={navLinkClass(pathname === "/e-book")}>
            E-Book
          </Link>

          <Link
            href="/kontributor"
            className={navLinkClass(pathname.startsWith("/kontributor"))}
          >
            Kontributor
          </Link>
          <Link
            href="/tentang-kami"
            className={navLinkClass(pathname === "/tentang-kami")}
          >
            Tentang
          </Link>
        </nav>
      </div>
    </header>
  );
}
