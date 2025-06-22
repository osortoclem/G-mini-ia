import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://nekos.best/api/v2/meme');
    const json = await response.json();

    const data = json.results?.[0];

    if (!data || !data.url) {
      return res.status(404).json({ error: 'No se encontró meme válido' });
    }

    res.status(200).json({
      title: data.artist_name || 'Meme de nekos.best',
      url: data.url,
      type: data.url.endsWith('.mp4') ? 'video' : 'image'
    });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: 'Error interno del servidor 😿' });
  }
}