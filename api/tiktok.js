import cheerio from "cheerio";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "URL inválida de TikTok" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const scripts = $('script[type="application/ld+json"]');
    if (!scripts.length) {
      return res.status(500).json({ error: "No se encontró metadata del video" });
    }

    const metadata = JSON.parse(scripts.first().html());
    const videoUrl = metadata.contentUrl;

    return res.status(200).json({
      title: metadata.description,
      author: metadata.author.name,
      video_url: videoUrl,
      thumbnail: metadata.thumbnailUrl,
    });
  } catch (e) {
    return res.status(500).json({ error: "Error al procesar la URL", detalle: e.message });
  }
}