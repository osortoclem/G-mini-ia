import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://9gag.com/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const memes = [];

    $('article').each((i, el) => {
      const image = $(el).find('img').attr('src');
      const video = $(el).find('video source').attr('src');
      const title = $(el).find('h2').text().trim();

      if (video) {
        memes.push({ url: video, type: 'video', title });
      } else if (image && image.startsWith('https://')) {
        memes.push({ url: image, type: 'image', title });
      }
    });

    const meme = memes[Math.floor(Math.random() * memes.length)];

    if (!meme) {
      return res.status(404).json({ error: 'No se encontraron memes' });
    }

    res.status(200).json(meme);

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: 'Error interno del servidor 😿' });
  }
}