export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Aumenta tamaño para imágenes grandes
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    prompts = [],
    imageBase64List = [],
    imageUrls = [],
    mimeTypes = [],
    history = [],
    temperature = 0.7,
    topP = 1.0
  } = req.body;

  const parts = [];

  // Agregar texto
  prompts.forEach(prompt => {
    if (prompt && typeof prompt === 'string') {
      parts.push({ text: prompt });
    }
  });

  // Agregar imágenes base64
  for (let i = 0; i < imageBase64List.length; i++) {
    const base64 = imageBase64List[i];
    const mimeType = mimeTypes[i] || 'image/jpeg';

    if (base64) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64.replace(/^data:[^,]+,/, '')
        }
      });
    }
  }

  // Agregar imágenes por URL
  for (let url of imageUrls) {
    if (!url) continue;
    try {
      const imageRes = await fetch(url);
      const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
      const buffer = await imageRes.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');

      parts.push({
        inline_data: {
          mime_type: contentType,
          data: base64Data
        }
      });
    } catch (error) {
      return res.status(400).json({ error: 'Error loading image from URL', details: error.toString() });
    }
  }

  // Construir payload
  const payload = {
    contents: [
      ...history, // historial opcional
      {
        role: 'user',
        parts
      }
    ],
    generationConfig: {
      temperature,
      topP
    }
  };

  // Enviar a Gemini
  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA3rQorwUMGCMm-g6Bn7ewlw9qjwTpEjpE`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await geminiResponse.json();
  res.status(200).json(data);
}