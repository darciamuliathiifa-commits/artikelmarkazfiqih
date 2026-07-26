import { headers } from "next/headers";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

import { auth } from "@/lib/auth";
import { getAllQuestions } from "@/db/queries/questions";

const STATUS_LABELS: Record<string, string> = {
  belum_dijawab: "Belum Dijawab",
  sudah_dijawab: "Sudah Dijawab",
  diarsipkan: "Diarsipkan",
};

export async function GET() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const questions = await getAllQuestions();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pertanyaan Masuk");

  sheet.columns = [
    { header: "Nama", key: "name", width: 24 },
    { header: "Kota", key: "city", width: 18 },
    { header: "Topik", key: "topic", width: 16 },
    { header: "Pertanyaan", key: "question", width: 60 },
    { header: "Boleh Dipublikasikan", key: "consent", width: 20 },
    { header: "Status", key: "status", width: 16 },
    { header: "Tanggal", key: "createdAt", width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const item of questions) {
    sheet.addRow({
      name: item.name || "Anonim",
      city: item.city,
      topic: item.topic || "-",
      question: item.question,
      consent: item.consent ? "Ya" : "Tidak",
      status: STATUS_LABELS[item.status] ?? item.status,
      createdAt: item.createdAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
  }

  for (const row of sheet.getRows(1, sheet.rowCount) ?? []) {
    row.alignment = { vertical: "top", wrapText: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `pertanyaan-masuk-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
