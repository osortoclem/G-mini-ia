```
import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `💡 Ingresa una pregunta para que Gemini la responda.\n\nEjemplo:\n${usedPrefix + command} ¿Qué es un agujero negro?`, m)
  }

  try {
    await m.react('🤖') // Indicador de procesamiento
    conn.sendPresenceUpdate('composing', m.chat)

    const res = await fetch('https://g-mini-ia.vercel.app/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompts: [text],
        temperature: 0.7
      })
    })

    const data = await res.json()

    const respuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!respuesta) throw '❌ No se recibió respuesta válida de la IA.'

    await m.reply(respuesta.trim())

  } catch (e) {
    console.error(e)
    await m.react('⚠️')
    await conn.reply(m.chat, '⚠️ Ocurrió un error. Gemini no pudo responder.', m)
  }
}

handler.command = ['ia']
handler.help = ['ia <texto>']
handler.tags = ['ai']
handler.group = false // o true si solo en grupos

export default handler
```