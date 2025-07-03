// API para buscar stickers de Sticker.ly
import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ status: false, message: 'Falta parámetro ?q=' })

  const result = await fetch('https://api.sticker.ly/v1/pack/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Sticker.ly/1.19.0 (Android 12)'
    },
    body: JSON.stringify({ query: q, page: 1, language: 'es' })
  })

  const data = await result.json()
  return res.status(200).json({ status: true, results: data.results })
}