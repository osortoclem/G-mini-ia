// api/search.js
import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ status: false, error: '❌ Falta el parámetro ?q=' })

  try {
    const url = `https://sticker.ly/s/${encodeURIComponent(q)}`
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 10)'
      }
    })

    const html = await response.text()
    const $ = cheerio.load(html)
    const results = []

    $('a[href*="/s/"]').each((_, el) => {
      const href = $(el).attr('href')
      const name = $(el).find('.title').text().trim()
      const author = $(el).find('.author').text().trim()
      const thumbnail = $(el).find('img').attr('src')

      if (href && name && thumbnail) {
        results.push({
          name,
          author,
          url: 'https://sticker.ly' + href,
          thumbnail
        })
      }
    })

    return res.status(200).json({
      status: true,
      total: results.length,
      result: results
    })
  } catch (err) {
    return res.status(500).json({ status: false, error: '⚠️ Error interno del servidor', details: err.message })
  }
}