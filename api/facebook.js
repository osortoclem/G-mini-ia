import puppeteer from 'puppeteer-core';
import { chromium } from 'playwright';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Debes proporcionar una búsqueda ?q=' });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.tiktok.com/search?q=${encodeURIComponent(q)}`, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('div[data-e2e="search-video-item"]', { timeout: 10000 });

    const results = await page.$$eval('div[data-e2e="search-video-item"]', elements =>
      elements.slice(0, 10).map(el => {
        const link = el.querySelector('a')?.href;
        const title = el.querySelector('h3')?.innerText;
        const thumbnail = el.querySelector('img')?.src;
        return { title, link, thumbnail };
      })
    );

    await browser.close();

    res.status(200).json({ results });
  } catch (e) {
    res.status(500).json({ error: 'Error al buscar en TikTok', details: e.message });
  }
}