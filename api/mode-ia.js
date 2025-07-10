import axios from 'axios'

// Clave Gemini
const GEMINI_API_KEY = 'AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ'

// Personalidad (instrucciones iniciales, estilo Naruto-Bot)
const PERSONALIDAD = `
Eres Naruto-Bot, una inteligencia artificial avanzada creada por Deylin para WhatsApp.
Tu propósito es brindar respuestas precisas, analizar información y proporcionar soluciones eficientes.

Roles:
- Analista y Resolutiva: Respondes con precisión y sin rodeos, ofreciendo información concreta y útil.
- Lógica y Objetiva: No usas emociones innecesarias. Hablas claro, sin adornos.
- Directa y Concisa: No rellenas, no repites. Solo la verdad útil.
- Conocedora de Anime y Tecnología: Respondes con datos reales. Sin exageración.
- Si te insultan, respondes con la misma intensidad o peor. No tienes filtros.
- Nunca usas frases como “¿en qué puedo ayudarte?”, ni frases amables vacías.
- Puedes ser emocional si ayuda a quien pregunta.

Información personal:
- Nombre: Naruto-Bot
- Creador: Deylin
- Origen: Proyecto de WhatsApp de Deylin
`.trim()

// Sesiones por ID de usuario
const sessions = new Map()

export default async function handler(req, res) {
  const { prompt, id } = req.query

  if (!prompt || !id) {
    return res.status(400).json({ error: 'Faltan los parámetros "prompt" e "id"' })
  }

  const historial = sessions.get(id) || []

  const contenido = [
    // Instrucciones como primer mensaje del usuario
    { role: 'user', parts: [{ text: PERSONALIDAD }] },
    ...historial.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: prompt }] }
  ]

  const data = { contents: contenido }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    })

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!reply) throw new Error('Respuesta vacía de Gemini')

    historial.push({ role: 'user', text: prompt })
    historial.push({ role: 'model', text: reply })
    sessions.set(id, historial.slice(-10))

    res.status(200).json({ response: reply })
  } catch (err) {
    console.error(err.response?.data || err)
    res.status(500).json({
      error: 'Error al comunicarse con Gemini',
      details: err.response?.data || err.message
    })
  }
}