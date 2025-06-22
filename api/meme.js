import hispamemes from 'hispamemes'

export default async function handler(req, res) {
  try {
    const memeUrl = hispamemes.meme()
    res.status(200).json({ url: memeUrl })
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el meme' })
  }
}