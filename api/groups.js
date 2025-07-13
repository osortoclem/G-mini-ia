import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req, res) {
  const { categoria } = req.query
  if (!categoria)
    return res.status(400).json({ error: 'Falta el parámetro ?categoria=' })

  const url = `https://gruposwhats.com/${categoria}/`

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(data)
    const results = []

    $('.fusion-column-wrapper').each((i, el) => {
      if (results.length >= 10) return

      const name = $(el).find('h4').text().trim()
      const description = $(el).find('p').first().text().trim()
      const link = $(el).find('a[href*="chat.whatsapp.com"]').attr('href')

      if (name && link) {
        results.push({ name, description, link })
      }
    })

    if (results.length === 0)
      return res.status(404).json({ error: 'No se encontraron grupos.' })

    res.status(200).json(results)
  } catch (e) {
    console.error('Error scraping:', e.message)
    res.status(500).json({ error: 'Error al obtener los datos.' })
  }
}