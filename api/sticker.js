import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ status: false, message: '❌ Falta el parámetro ?q=' })

  try {
    const searchURL = `https://sticker.ly/s/${encodeURIComponent(q)}`
    const response = await fetch(searchURL)
    const html = await response.text()
    const $ = cheerio.load(html)

    const packs = []

    $('a[href*="/s/"]').each((_, el) => {
      const href = $(el).attr('href')
      const name = $(el).find('.title')?.text()?.trim()
      const author = $(el).find('.author')?.text()?.trim()
      const thumbnail = $(el).find('img').attr('src')

      if (href && name && thumbnail) {
        packs.push({
          name,
          author,
          url: `https://sticker.ly${href}`,
          thumbnail
        })
      }
    })

    return res.json({ status: true, total: packs.length, result: packs })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ status: false, message: 'Error interno del servidor' })
  }
}