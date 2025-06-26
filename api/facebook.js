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

    // REGISTRO EN CONSOLA PARA VER QUÉ LLEGÓ
    console.log(html.slice(0, 300)) // Solo los primeros 300 caracteres

    const $ = cheerio.load(html)
    const videoUrl = $('meta[property="og:video"]').attr('content')
    const thumbnail = $('meta[property="og:image"]').attr('content')
    const title = $('meta[property="og:title"]').attr('content')

    if (!videoUrl) {
      return res.status(500).json({ error: 'No se pudo obtener el video. Facebook devolvió HTML inesperado.' })
    }

    return res.status(200).json({
      title: title || 'Video de Facebook',
      video_url: videoUrl,
      thumbnail,
    })
  } catch (err) {
    console.error('Error:', err.message)
    return res.status(500).json({ error: 'Error al procesar la URL', detalle: err.message })
  }
}