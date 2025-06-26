import { chromium } from 'playwright';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Falta la palabra clave de búsqueda (?q=)' });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const searchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('div[data-e2e="search-video-item"]', { timeout: 10000 });

    const results = await page.$$eval('div[data-e2e="search-video-item"]', items =>
      items.slice(0, 10).map(item => {
        const a = item.querySelector('a');
        const title = item.querySelector('h3')?.innerText || 'Sin título';
        const thumbnail = item.querySelector('img')?.src;
        return {
          title,
          url: a?.href || '',
          thumbnail
        };
      })
    );

    await browser.close();

    return res.status(200).json({ query: q, results });
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar en TikTok', detalle: err.message });
  }
}