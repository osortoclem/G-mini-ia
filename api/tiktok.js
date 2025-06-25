import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "URL inválida de TikTok" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const scriptTag = $('script[type="application/ld+json"]').first();
    if (!scriptTag.length) {
      return res.status(500).json({ error: "No se encontró metadata del video" });
    }

    const metadata = JSON.parse(scriptTag.html());
    const videoUrl = metadata.contentUrl;

    return res.status(200).json({
      title: metadata.description,
      author: metadata.author.name,
      video_url: videoUrl,
      thumbnail: metadata.thumbnailUrl
    });
  } catch (e) {
    return res.status(500).json({ error: "Error al procesar la URL", detalle: e.message });
  }
}