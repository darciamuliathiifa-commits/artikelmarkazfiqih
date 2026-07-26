import { getCategoriesWithArticleCount } from "@/db/queries/categories";
import { TrendingTopicsCarousel } from "@/components/home/sidebar/trending-topics-carousel";

export async function TrendingTopics() {
  const categories = await getCategoriesWithArticleCount();
  const trending = categories
    .filter((category) => category.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount);

  if (trending.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Kategori Populer
      </h2>
      <TrendingTopicsCarousel categories={trending} />
    </div>
  );
}
