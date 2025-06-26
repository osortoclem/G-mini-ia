export default async function handler(req, res) {
  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://www.reddit.com/r/nsfw.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeylinBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('Reddit proxy error:', e.message);
    res.status(500).json({ error: 'No se pudo obtener contenido de Reddit 🥱' });
  }
}