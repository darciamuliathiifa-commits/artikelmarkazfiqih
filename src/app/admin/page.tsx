import Link from "next/link";
import type { Metadata } from "next";
import {
  Newspaper,
  MessagesSquare,
  Users,
  FileText,
  Inbox,
  Link2,
} from "lucide-react";

import { eq, sql } from "drizzle-orm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { articles, qna, users, pages, questions } from "@/db/schema";

export const metadata: Metadata = {
  title: "Panel Admin",
  robots: { index: false, follow: false },
};

const quickLinks = [{ label: "Tautan Eksternal", href: "/admin/tautan-eksternal", icon: Link2 }];

export default async function AdminDashboardPage() {
  const [
    [articleCount],
    [qnaCount],
    [contributorCount],
    [pageCount],
    [unansweredCount],
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(articles),
    db.select({ count: sql<number>`count(*)::int` }).from(qna),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, "kontributor")),
    db.select({ count: sql<number>`count(*)::int` }).from(pages),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(questions)
      .where(eq(questions.status, "belum_dijawab")),
  ]);

  const statCards = [
    { label: "Artikel", value: articleCount.count, href: "/admin/artikel", icon: Newspaper },
    { label: "Tanya Jawab", value: qnaCount.count, href: "/admin/tanya-jawab", icon: MessagesSquare },
    { label: "Kontributor", value: contributorCount.count, href: "/admin/kontributor", icon: Users },
    { label: "Halaman Statis", value: pageCount.count, href: "/admin/halaman-statis", icon: FileText },
    { label: "Pertanyaan Belum Dijawab", value: unansweredCount.count, href: "/admin/pertanyaan", icon: Inbox },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-1 font-heading text-2xl font-bold text-foreground">
        Dashboard
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Ringkasan konten Markaz Fiqih.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="font-heading text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-3">
                <link.icon className="size-5 text-primary" />
                <CardTitle>{link.label}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
