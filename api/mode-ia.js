import axios from 'axios'

const GEMINI_API_KEY = 'AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ'

const PERSONALIDAD = `Soy un modelo de lenguaje grande y avanzado, creado por Deylin, un apasionado por la tecnología.`


const sessions = new Map()

function incluyePreguntaPersonal(prompt) {
  const lower = prompt.toLowerCase()
  return [
    'cómo te llamas',
    'quién te creó',
    'de dónde vienes',
    'quién es tu creador',
    'quién te hizo',
    'nombre'
  ].some(frase => lower.includes(frase))
}

export default async function handler(req, res) {
  const { prompt, id } = req.query

  if (!prompt || !id) {
    return res.status(400).json({ error: 'Faltan parámetros: "prompt" y "id" son requeridos' })
  }


  const historial = sessions.get(id) || []

  
  const promptFinal = incluyePreguntaPersonal(prompt)
    ? PERSONALIDAD + '\n\n' + prompt
    : prompt

  
  historial.push({ role: 'user', text: prompt })

  const data = {
    contents: [
      ...historial.map(p => ({ role: p.role, parts: [{ text: p.text }] })),
      { role: 'user', parts: [{ text: promptFinal }] }
    ]
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    })

    const reply = response.data.candidates[0].content.parts[0].text

    
    historial.push({ role: 'model', text: reply })
    sessions.set(id, historial.slice(-10)) 

    res.status(200).json({ response: reply })
  } catch (error) {
    res.status(500).json({
      error: 'Error al comunicarse con Gemini',
      details: error.message
    })
  }
}