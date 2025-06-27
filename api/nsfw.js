// api/nsfw.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const categories = ['waifu', 'neko', 'trap', 'blowjob'];
  const type = categories[Math.floor(Math.random() * categories.length)];
  const url = `https://api.waifu.pics/nsfw/${type}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      type,
      url: data.url
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener imagen NSFW',
      detalle: error.message
    });
  }
}