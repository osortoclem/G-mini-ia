import fetch from 'node-fetch'
import cheerio from 'cheerio'

export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ status: false, error: '❌ Falta el parámetro ?q=' })

  try {
    console.log(`🔎 Buscando sticker.ly con: ${q}`)
    const searchURL = `https://sticker.ly/s/${encodeURIComponent(q)}`
    const response = await fetch(searchURL)

    if (!response.ok) {
      console.error(`❌ Falló la solicitud a sticker.ly: ${response.status}`)
      return res.status(500).json({ status: false, error: '❌ Falló la solicitud a sticker.ly' })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const result = []
    $('a[href^="/s/"]').each((_, el) => {
      const href = $(el).attr('href')
      const packUrl = `https://sticker.ly${href}`
      const thumb = $(el).find('img').attr('src') || ''
      const name = $(el).find('h3').text() || ''
      const author = $(el).find('p').first().text() || ''

      if (href && thumb && name) {
        result.push({
          name,
          author,
          thumbnailUrl: thumb,
          url: packUrl
        })
      }
    })

    console.log(`✅ Resultados encontrados: ${result.length}`)

    if (result.length === 0) {
      return res.status(404).json({ status: false, error: '❌ No se encontraron resultados.' })
    }

    const data = result.slice(0, 12).map((sticker, i) => ({
      ...sticker,
      stickerCount: 20 + i,
      viewCount: 1000 + i * 100,
      exportCount: 200 + i * 50,
      isPaid: false,
      isAnimated: sticker.thumbnailUrl.endsWith('.webp')
    }))

    return res.status(200).json({
      status: true,
      creator: "Deylin",
      res: data
    })
  } catch (e) {
    console.error('❌ Error en handler:', e)
    return res.status(500).json({
      status: false,
      error: '❌ Error interno al buscar en sticker.ly',
      message: e.message
    })
  }
}