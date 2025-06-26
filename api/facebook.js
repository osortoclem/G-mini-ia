import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Falta el parámetro ?q=' });

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto(`https://www.tiktok.com/search?q=${encodeURIComponent(q)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForSelector('div[data-e2e="search-video-item"]', { timeout: 10000 });

    const results = await page.$$eval('div[data-e2e="search-video-item"]', items =>
      items.slice(0, 10).map(item => {
        const a = item.querySelector('a');
        const title = item.querySelector('h3')?.innerText || 'Sin título';
        const thumbnail = item.querySelector('img')?.src;
        return {
          title,
          url: a?.href || '',
          thumbnail,
        };
      })
    );

    await browser.close();
    return res.status(200).json({ query: q, results });
  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Error al buscar en TikTok', detalle: err.message });
  }
}