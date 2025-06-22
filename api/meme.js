// Alternativa para redirección directa
export default async function handler(req, res) {
  try {
    const memeUrl = hispamemes.meme()
    res.redirect(memeUrl)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo redirigir al meme' })
  }
}