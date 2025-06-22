import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const r = await fetch('https://some-random-api.com/meme');
    const json = await r.json();

    if (!json || !json.image) {
      return res.status(404).json({ error: 'No se encontró meme válido' });
    }

    res.status(200).json({
      title: json.caption || 'Meme',
      url: json.image,
      type: json.image.endsWith('.mp4') ? 'video' : 'image'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor 😿' });
  }
}