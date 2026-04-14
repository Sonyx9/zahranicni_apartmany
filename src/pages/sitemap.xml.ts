import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCountries } from '../lib/data';

function absoluteUrl(siteUrl: string, base: string, path: string): string {
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${basePath}${p}`;
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.href?.replace(/\/$/, '') || 'https://zahranicniapartmany.cz';
  const base = site ? new URL(site).pathname : '/';
  const baseNorm = base.endsWith('/') ? base : `${base}/`;
  const buildDate = new Date().toISOString().split('T')[0];

  const countries = getCountries();
  const guides = await getCollection('guides');

  const staticPages: { path: string; priority: string; lastmod?: string; images?: { loc: string; title: string }[] }[] = [
    {
      path: '',
      priority: '1.0',
      lastmod: buildDate,
      images: [
        { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/hero-bg.webp'), title: 'Apartmány u moře – hero' },
        { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/logo.png'), title: 'Zahraniční apartmány – logo' },
      ],
    },
    { path: '/destinace/', priority: '0.8', lastmod: buildDate },
    { path: '/nabidky/', priority: '0.6', lastmod: buildDate },
    { path: '/pruvodce/', priority: '0.7', lastmod: buildDate },
    { path: '/o-projektu/', priority: '0.6', lastmod: buildDate, images: [
      { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/team-adam-kovarik.webp'), title: 'Adam Kovařík' },
      { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/team-katerina-holubova.webp'), title: 'Kateřina Holubová' },
      { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/team-tomas-vavra.webp'), title: 'Tomáš Vávra' },
      { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/team-lenka-dolezalova.webp'), title: 'Lenka Doležalová' },
      { loc: absoluteUrl(siteUrl, baseNorm, 'images/site/team-anna-horakova.png'), title: 'Anna Horáková' },
    ] },
    { path: '/luxusni-vily/', priority: '0.6', lastmod: buildDate },
  ];

  const countryPages = countries.map((country) => ({
    path: `/destinace/${country.slug}/`,
    priority: '0.8',
    lastmod: buildDate,
    images: [
      {
        loc: absoluteUrl(siteUrl, baseNorm, country.heroImage.startsWith('/') ? country.heroImage.slice(1) : country.heroImage),
        title: `Nemovitosti u moře – ${country.name}`,
      },
    ],
  }));

  const guidePages = guides.map((guide) => ({
    path: `/pruvodce/${guide.slug}/`,
    priority: '0.7',
    lastmod: guide.data.published.toISOString().split('T')[0],
    images: [] as { loc: string; title: string }[],
  }));

  const allPages = [...staticPages, ...countryPages, ...guidePages];

  const urlset = allPages
    .map(({ path, priority, lastmod, images }) => {
      const loc = absoluteUrl(siteUrl, baseNorm, path.startsWith('/') ? path.slice(1) : path);
      const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      const imageLines =
        images && images.length > 0
          ? images
              .map(
                (img) =>
                  `\n    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>\n      <image:title>${escapeXml(img.title)}</image:title>\n    </image:image>`
              )
              .join('')
          : '';
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${lastmodLine}${imageLines}
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlset}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
