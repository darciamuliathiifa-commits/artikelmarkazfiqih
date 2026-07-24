import type { Metadata } from "next";

import { getAllQuestions } from "@/db/queries/questions";
import { getAllQnaTopics } from "@/db/queries/qna-topics";
import { QuestionListTable } from "@/components/admin/question-list-table";

export const metadata: Metadata = {
  title: "Pertanyaan Masuk",
  robots: { index: false, follow: false },
};

export default async function AdminQuestionsPage() {
  const [questions, topics] = await Promise.all([
    getAllQuestions(),
    getAllQnaTopics(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <QuestionListTable initialQuestions={questions} topics={topics} />
    </div>
  );
}
