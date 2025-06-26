import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.reddit.com/r/nsfw.json?limit=50', {
      headers: { 'User-Agent': 'DeylinBot/1.0' }
    });

    if (!response.ok) throw new Error(`Reddit status: ${response.status}`);

    const json = await response.json();
    const allPosts = json?.data?.children || [];

    const filtered = allPosts
      .map(post => post.data)
      .filter(post =>
        post.url &&
        (
          post.url.endsWith('.jpg') ||
          post.url.endsWith('.png') ||
          post.url.endsWith('.gif') ||
          post.url.includes('redgifs.com')
        )
      );

    const random = filtered.sort(() => Math.random() - 0.5).slice(0, 2);

    const resultados = random.map(post => ({
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
    console.error('Reddit error:', e.message);
    res.status(500).json({ error: 'Error al obtener datos de Reddit' });
  }
}