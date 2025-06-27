// api/nsfw.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const endpoints = [
    'boobs', 'anal', 'classic', 'pussy', 'tits', 'les', 'solo', 'kuni'
  ];

  const type = endpoints[Math.floor(Math.random() * endpoints.length)];
  const url = `https://nekos.life/api/v2/img/${type}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    res.status(200).json({
      type,
      url: json.url
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener imagen NSFW',
      detalle: error.message
    });
  }
}