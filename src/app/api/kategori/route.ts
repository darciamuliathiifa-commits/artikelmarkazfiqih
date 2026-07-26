import { NextResponse } from "next/server";

import { getAllCategories } from "@/db/queries/categories";

export async function GET() {
  const categories = await getAllCategories();

  return NextResponse.json({
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
  });
}
