import cheerio from 'cheerio'
import https from 'https'
import iconv from 'iconv-lite'

export default async function handler(req, res) {
  const tema = req.query.q
  if (!tema) return res.status(400).json({ error: 'Falta el parámetro ?q=' })

  const url = `https://www.gruposwats.com/${encodeURIComponent(tema)}.html`

  try {
    const html = await fetchLatin1(url)
    const $ = cheerio.load(html)

    const grupos = []

    $('.divgrupowhatsapp').each((_, el) => {
      const nombre = $(el).find('.grupo_nombre').text().trim()
      const descripcion = $(el).find('.grupo_descripcion').text().trim()
      const categoria = $(el).find('.grupo_categoria').text().trim()
      const img = $(el).find('img.img_grupowasap').attr('src')
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

// Función para leer páginas con encoding windows-1252
async function fetchLatin1(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const decoded = iconv.decode(buffer, 'windows-1252')
        resolve(decoded)
      })
    }).on('error', reject)
  })
}