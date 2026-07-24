import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { QnaTopicManager } from "@/components/admin/qna-topic-manager";
import { getAllQnaTopics } from "@/db/queries/qna-topics";
import { db } from "@/db";
import { questions } from "@/db/schema";

export const metadata: Metadata = {
  title: "Kelola Topik Tanya Jawab",
  robots: { index: false, follow: false },
};

export default async function AdminQnaTopicPage() {
  const [topics, questionRows] = await Promise.all([
    getAllQnaTopics(),
    db.select({ topic: questions.topic }).from(questions),
  ]);

  const usageCounts = new Map<string, number>();
  for (const row of questionRows) {
    if (!row.topic) continue;
    usageCounts.set(row.topic, (usageCounts.get(row.topic) ?? 0) + 1);
  }

  const initialTopics = topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    usageCount: usageCounts.get(topic.name) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/admin/pertanyaan"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Kembali ke pertanyaan masuk
      </Link>

      <QnaTopicManager initialTopics={initialTopics} />
    </div>
  );
}
