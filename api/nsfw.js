export default async function handler(req, res) {
  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://www.reddit.com/r/nsfw.json?limit=50&raw_json=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeylinBot/1.0)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Reddit status: ${response.status}`);

    const json = await response.json();
    const posts = json?.data?.children || [];

    const filtered = posts
      .map(p => p.data)
      .filter(post =>
        post.url &&
        (
          post.url.endsWith('.jpg') ||
          post.url.endsWith('.png') ||
          post.url.endsWith('.gif') ||
          post.url.includes('redgifs.com')
        )
      );

    const selected = filtered.sort(() => Math.random() - 0.5).slice(0, 2);

    const resultados = selected.map(post => ({
      title: post.title,
      url: post.url,
      thumbnail: post.thumbnail,
      ups: post.ups,
      author: post.author,
      postLink: `https://www.reddit.com${post.permalink}`
    }));

    res.status(200).json({
      autor: 'Deylin',
      total: resultados.length,
      resultados
    });
  } catch (e) {
    console.error('Reddit fetch error:', e.message);
    res.status(500).json({ error: 'Error al obtener datos de Reddit 🙀' });
  }
}