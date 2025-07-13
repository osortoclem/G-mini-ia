import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req, res) {
  const { categoria } = req.query
  if (!categoria) return res.status(400).json({ error: 'Falta el parámetro ?categoria=' })

  const url = `https://www.gruposwats.com/${categoria}.html`
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const $ = cheerio.load(data)
    const results = []

    $('div.list-grupo').each((i, el) => {
      if (results.length >= 10) return

      const name = $(el).find('h3').text().trim()
      const description = $(el).find('p').first().text().trim()
      const link = $(el).find('a').attr('href')

      if (name && link) {
        results.push({ name, description, link })
      }
    })

    res.status(200).json(results)
  } catch (e) {
    console.error('Scraping error:', e)
    res.status(500).json({ error: 'No se pudo procesar la solicitud.' })
  }
}