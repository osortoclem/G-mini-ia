// api/nsfw.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const redditURL = 'https://www.reddit.com/r/nsfw.json?limit=50';
    const response = await fetch(redditURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Error al acceder a Reddit', status: response.status });
    }

    const json = await response.json();
    const posts = json?.data?.children?.filter(p => p?.data?.url);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: 'No se encontraron publicaciones' });
    }

    const random = posts[Math.floor(Math.random() * posts.length)];
    const { title, author, url, thumbnail, permalink, over_18 } = random.data;

    res.status(200).json({
      title,
      author,
      url,
      thumbnail,
      over_18,
      reddit_url: `https://www.reddit.com${permalink}`
    });
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor', detalle: e.message });
  }
}