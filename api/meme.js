import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://imgur.com/r/memes/hot');
    const html = await response.text();
    const $ = cheerio.load(html);

    const memes = [];

    $('a.image-list-link').each((i, el) => {
      const path = $(el).attr('href');
      if (path) memes.push(`https://i.imgur.com${path}.jpg`);
    });

    const url = memes[Math.floor(Math.random() * memes.length)];

    res.status(200).json({
      title: 'Random meme from Imgur',
      url,
      type: 'image'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo obtener memes desde Imgur' });
  }
}