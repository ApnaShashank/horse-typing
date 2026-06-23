import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://horsetyping.vercel.app';
  const routes = [
    '',
    '/practice',
    '/learn',
    '/ai-practice',
    '/leaderboard',
    '/login',
    '/register',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/leaderboard' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : route === '/practice' || route === '/learn' ? 0.9 : 0.5,
  }));
}
