import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const r = await fetch('https://meme-api.com/gimme');
    if (!r.ok) {
      const text = await r.text();
      throw new Error(`HTTP ${r.status}: ${text}`);
    }
    const json = await r.json();

    if (!json || !json.url) {
      return res.status(404).json({ error: 'No se encontró meme válido 😃' });
    }

    res.status(200).json({
      title: json.title || 'Meme',
      url: json.url,
      type: json.url.endsWith('.mp4') ? 'video' : 'image',
      postLink: json.postLink,
      subreddit: json.subreddit,
      author: json.author,
      ups: json.ups
    });

  } catch (err) {
    console.error('ERROR en API /meme:', err);
    res.status(500).json({ error: `Error interno del servidor 😿 - ${err.message}` });
  }
}