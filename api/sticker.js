// api/stickerly.js
import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const query = req.query.q
  if (!query) {
    return res.status(400).json({ error: 'Parámetro "q" requerido' })
  }

  const url = `https://sticker.ly/s?q=${encodeURIComponent(query)}`
  try {
    const html = await fetch(url).then(r => r.text())
    const $ = cheerio.load(html)
    const results = []

    $('a[href^="/s/"]').each((_, el) => {
      const link = 'https://sticker.ly' + $(el).attr('href')
      const title = $(el).find('.pack-name').text().trim()
      const author = $(el).find('.pack-author').text().trim()
      const thumbnail = $(el).find('img').attr('src')

      if (title && thumbnail) {
        results.push({
          name: title,
          author,
          thumbnail,
          url: link
        })
      }
    })

    return res.status(200).json({
      status: true,
      creator: "Deylin",
      result: results
    })
  } catch (e) {
    return res.status(500).json({ error: 'Error al buscar en Sticker.ly', detail: e.message })
  }
}