import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://plot.drama";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/discover", "/search", "/story/", "/library", "/achievements"],
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
