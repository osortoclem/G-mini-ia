import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append('data', buffer, { filename: 'image.jpg' });

    const hfRes = await fetch('https://hf.space/embed/TachibanaYoshino/AnimeGANv2/+/api/predict/', {
      method: 'POST',
      body: form,
    });

    const json = await hfRes.json();

    const animeUrl = json?.data?.[0]?.[0];

    if (!animeUrl) return res.status(500).json({ error: 'No se pudo obtener imagen de salida.' });

    const imgRes = await fetch(animeUrl);
    const animeImg = await imgRes.arrayBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(Buffer.from(animeImg));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al convertir la imagen.' });
  }
}