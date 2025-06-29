import fs from 'fs'
import path from 'path'
import { IncomingForm } from 'formidable'
import FormData from 'form-data'
import fetch from 'node-fetch'

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido')

  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err || !files.audio) return res.status(400).json({ error: 'Audio no recibido' })

    try {
      const filePath = files.audio.filepath
      const audioForm = new FormData()
      audioForm.append('audio', fs.createReadStream(filePath))

      const whisperRes = await fetch('https://whisper.lablab.ai/asr', {
        method: 'POST',
        body: audioForm,
        headers: audioForm.getHeaders()
      })

      const result = await whisperRes.json()

      if (result && result.text) {
        res.json({ text: result.text })
      } else {
        res.status(500).json({ error: 'Error al transcribir' })
      }

      fs.unlinkSync(filePath)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Error interno' })
    }
  })
}