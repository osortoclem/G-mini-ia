import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Falta el parámetro ?q=' })

  const searchUrl = `https://whatsgrouplink.com/?s=${encodeURIComponent(q)}`
  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    })

    const $ = cheerio.load(data)
    const results = []

    $('article.jeg_post').each((i, el) => {
      if (results.length >= 10) return

      const name = $(el).find('.jeg_post_title > a').text().trim()
      const postUrl = $(el).find('.jeg_post_title > a').attr('href')

      if (!postUrl) return

      results.push({ name, description: '', link: postUrl })
    })

    res.status(200).json(results)
  } catch (e) {
    console.error('Error al hacer scraping:', e)
    res.status(500).json({ error: 'Error interno al procesar la solicitud.' })
  }
}