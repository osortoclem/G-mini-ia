import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { url } = req.query

  if (!url || !url.includes('facebook.com')) {
    return res.status(400).json({ error: 'URL inválida de Facebook' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    })

    const html = await response.text()
    const $ = cheerio.load(html)

    // Facebook a veces incluye el video como <meta property="og:video" content="..." />
    const videoUrl = $('meta[property="og:video"]').attr('content')
    const thumbnail = $('meta[property="og:image"]').attr('content')
    const title = $('meta[property="og:title"]').attr('content')

    if (!videoUrl) {
      return res.status(500).json({ error: 'No se pudo obtener el video. Asegúrate de que el enlace sea público.' })
    }

    return res.status(200).json({
      title: title || 'Video de Facebook',
      video_url: videoUrl,
      thumbnail,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Error al procesar la URL', detalle: err.message })
  }
}