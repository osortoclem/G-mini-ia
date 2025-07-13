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
    $('.jeg_post').each((i, el) => {
      if (results.length >= 10) return

      const name = $(el).find('.jeg_post_title a').text().trim()
      const link = $(el).find('.jeg_post_title a').attr('href')
      const description = $(el).find('.jeg_post_excerpt p').text().trim()

      if (name && link) {
        results.push({ name, description, link })
      }
    })

    res.status(200).json(results)
  } catch (e) {
    res.status(500).json({ error: 'Ocurrió un error al obtener los datos.' })
  }
}