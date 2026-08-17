import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://plot.drama";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/discover`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${appUrl}/achievements`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const stories = await db.story.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, episodes: { select: { number: true } } },
    });

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    stories.forEach((story) => {
      dynamicRoutes.push({
        url: `${appUrl}/story/${story.slug}`,
        lastModified: story.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });

      story.episodes.forEach((ep) => {
        dynamicRoutes.push({
          url: `${appUrl}/story/${story.slug}/episode/${ep.number}`,
          lastModified: story.updatedAt,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
