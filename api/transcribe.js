import fs from 'fs'
import { IncomingForm } from 'formidable'
import FormData from 'form-data'
import fetch from 'node-fetch'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Error al analizar formulario:', err)
      return res.status(400).json({ error: 'Error al procesar el formulario' })
    }

    if (!files.audio || !files.audio.filepath) {
      return res.status(400).json({ error: 'Archivo de audio no recibido' })
    }

    const filePath = files.audio.filepath

    try {
      const formData = new FormData()
      formData.append('audio', fs.createReadStream(filePath))

      const whisperRes = await fetch('https://whisper.lablab.ai/asr', {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      })

      const result = await whisperRes.json()
      console.log('📥 Whisper respondió:', result)

      fs.unlinkSync(filePath)

      if (result && result.text) {
        return res.status(200).json({ text: result.text })
      } else {
        return res.status(500).json({ error: 'No se pudo transcribir el audio.' })
      }
    } catch (e) {
      console.error('❌ Error interno:', e)
      return res.status(500).json({ error: 'Error interno al transcribir el audio.' })
    }
  })
}