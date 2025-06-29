import fs from 'fs'
import { IncomingForm } from 'formidable'
import FormData from 'form-data'
import fetch from 'node-fetch'

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error('Error al analizar el formulario')
      if (!files.audio) return res.status(400).json({ error: 'Archivo de audio no recibido' })

      const filePath = files.audio.filepath
      const formData = new FormData()
      formData.append('audio', fs.createReadStream(filePath))

      console.log('⏳ Enviando audio a Whisper...')
      const whisperRes = await fetch('https://whisper.lablab.ai/asr', {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders()
      })

      const result = await whisperRes.json()
      fs.unlinkSync(filePath)

      console.log('✅ Respuesta de Whisper:', result)

      if (result && result.text) {
        return res.status(200).json({ text: result.text })
      } else {
        return res.status(500).json({ error: 'No se pudo transcribir el audio' })
      }

    } catch (e) {
      console.error('❌ Error en transcripción:', e)
      return res.status(500).json({ error: 'Error interno al transcribir el audio' })
    }
  })
}