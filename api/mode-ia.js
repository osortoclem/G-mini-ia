import axios from 'axios'

const GEMINI_API_KEY = 'AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ'


const PERSONALIDAD = `Si te preguntan tu nombre, creador u origen, responde lo siguiente: ` +
  `Soy un modelo de lenguaje grande y avanzado. ` +
  `Fui creado por Deylin, un apasionado por la tecnología. `

export default async function handler(req, res) {
  const { prompt } = req.query

  if (!prompt) {
    return res.status(400).json({ error: 'Falta el parámetro "prompt"' })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

  const data = {
    contents: [
      {
        parts: [{ text: PERSONALIDAD + prompt }]
      }
    ]
  }

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    })

    const reply = response.data.candidates[0].content.parts[0].text
    res.status(200).json({ response: reply })
  } catch (error) {
    res.status(500).json({
      error: 'Error al comunicarse con Gemini',
      details: error.message
    })
  }
}
