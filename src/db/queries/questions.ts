import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { questions } from "@/db/schema";

export async function createQuestion(data: {
  name?: string;
  city: string;
  question: string;
  topic?: string;
  consent: boolean;
}) {
  const [created] = await db
    .insert(questions)
    .values({
      name: data.name?.trim() || null,
      city: data.city,
      question: data.question,
      topic: data.topic?.trim() || null,
      consent: data.consent,
    })
    .returning();

  return created;
}

export async function getAllQuestions() {
  return db.query.questions.findMany({
    orderBy: desc(questions.createdAt),
  });
}

export async function updateQuestionStatus(
  id: string,
  status: "belum_dijawab" | "sudah_dijawab" | "diarsipkan"
) {
  const [updated] = await db
    .update(questions)
    .set({ status })
    .where(eq(questions.id, id))
    .returning();

  return updated;
}

export async function deleteQuestion(id: string) {
  const [deleted] = await db
    .delete(questions)
    .where(eq(questions.id, id))
    .returning();

  return deleted;
}
