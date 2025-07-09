import axios from 'axios'
import cheerio from 'cheerio'

module.exports = async (req, res) => {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Falta el parámetro ?q=' })

  const searchUrl = `https://wallpaperaccess.com/search?q=${encodeURIComponent(q)}`
  try {
    const { data } = await axios.get(searchUrl)
    const $ = cheerio.load(data)
    const wallpapers = []

    $('.grid .image').each((_, el) => {
      const thumb = $(el).find('img').attr('src')
      if (thumb) {
        wallpapers.push({
          thumb: 'https://wallpaperaccess.com' + thumb,
          full: 'https://wallpaperaccess.com' + thumb.replace('/thumbs', '').replace('-thumb', '')
        })
      }
    })

    res.status(200).json({ query: q, count: wallpapers.length, results: wallpapers })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener wallpapers', detail: err.message })
  }
}