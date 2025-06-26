// api/facebook.js
export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.includes('facebook.com')) {
    return res.status(400).json({ error: 'URL inválida de Facebook.' });
  }

  try {
    const api = `https://vihangayt.me/download/facebook?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const json = await response.json();

    if (!json || !json.data?.url) {
      return res.status(404).json({ error: 'No se encontró video válido.' });
    }

    return res.status(200).json(json.data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al obtener el video.' });
  }
}