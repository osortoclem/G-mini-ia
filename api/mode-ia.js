import fetch from 'node-fetch'

const GEMINI_API_KEY = 'AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ'
const PERSONALIDAD = `Si te preguntan tu nombre, creador u origen, responde lo siguiente:
Fui desarrollado por Mode API con herramientas de Google. 
Soy un modelo de lenguaje grande y avanzado. 
El creador de Mode API es Deylin, un apasionado por la tecnología y la IA.`

// Memoria simple en RAM
const sesiones = new Map()

export async function consultaGemini(prompt, sessionId = 'default') {
  if (!sesiones.has(sessionId)) {
    sesiones.set(sessionId, [])
  }
  const historial = sesiones.get(sessionId)
  historial.push({ role: 'user', text: prompt })

  const messages = historial.map(msg => ({ text: msg.text }))

  const payload = {
    contents: [
      {
        parts: [
          PERSONALIDAD,
          ...messages.map(m => m.text)
        ].map(text => ({ text }))
      }
    ]
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )
    const result = await response.json()
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'

    historial.push({ role: 'bot', text: reply })

    return { reply, historial }
  } catch (error) {
    throw new Error('Error al comunicarse con Gemini: ' + error.message)
  }
}