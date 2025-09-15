import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://piqueunique.lt";
  const now = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${baseUrl}/themes`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${baseUrl}/gallery`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${baseUrl}/reviews`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.4, lastModified: now },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${baseUrl}/booking`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
  ];

  return routes;
}


