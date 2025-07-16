import fetch from 'node-fetch'
import cheerio from 'cheerio'

export default async function handler(req, res) {
  const tema = req.query.q
  if (!tema) return res.status(400).json({ error: 'Falta el parámetro ?q=' })

  const url = `https://www.gruposwats.com/${encodeURIComponent(tema)}.html`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('No se pudo acceder a la página')

    const html = await response.text()
    const $ = cheerio.load(html)

    const grupos = []

    $('.divgrupowhatsapp').each((i, el) => {
      const nombre = $(el).find('.titulo-grupo').text().trim()
      const descripcion = $(el).find('.descripcion-grupo').text().trim()
      const categoria = $(el).find('.categoria-grupo').text().trim()
      const img = $(el).find('img').attr('src')
      const link = $(el).find('a').attr('href')

      if (nombre && link) {
        grupos.push({
          nombre,
          descripcion,
          categoria,
          img: img?.startsWith('http') ? img : `https://www.gruposwats.com/${img}`,
          link
        })
      }
    })

    res.status(200).json({ tema, cantidad: grupos.length, grupos })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los grupos', detalles: err.message })
  }
}