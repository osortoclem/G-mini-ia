// api/nsfw.js

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.reddit.com/r/nsfw.json?limit=50');
    const data = await response.json();

    const posts = data.data.children
      .filter(post => post.data?.url && !post.data.over_18 === false)
      .map(post => ({
        title: post.data.title,
        url: post.data.url,
        author: post.data.author,
        ups: post.data.ups
      }));

    const selected = posts.sort(() => 0.5 - Math.random()).slice(0, 2);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      autor: 'Deylin',
      cantidad: selected.length,
      resultados: selected
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de Reddit' });
  }
}