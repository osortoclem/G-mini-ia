import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

// Detectar prompt de imagen (puedes añadir o modificar keywords)
function isImagePrompt(prompt) {
  const keywords = [
    "genera una imagen",
    "imagina",
    "haz una imagen",
    "crear una imagen",
    "quiero una imagen",
    "muéstrame una imagen",
    "imagen de",
    "dibuja",
    "pinta",
    "una imagen de",
    "generar imagen"
  ];
  const lowerPrompt = prompt.toLowerCase();
  return keywords.some(keyword => lowerPrompt.includes(keyword));
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const {
    prompts = [],
    imageBase64List = [],
    imageUrls = [],
    mimeTypes = [],
    history = [],
    temperature = 0.7,
    topP = 1.0
  } = req.body;

  const promptText = prompts[0]?.trim();

  if (promptText && isImagePrompt(promptText)) {
    try {
      const encodedPrompt = encodeURIComponent(promptText);
      const imageUrl = `https://anime-xi-wheat.vercel.app/api/ia-img?prompt=${encodedPrompt}`;

      // La API externa devuelve una imagen directamente (image/jpeg o png, etc)
      // Hacemos fetch y convertimos a base64 para devolverlo embebido
      const imageRes = await fetch(imageUrl);

      if (!imageRes.ok) {
        return res.status(500).json({ error: 'Error al obtener imagen de la API externa', status: imageRes.status });
      }

      const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      return res.status(200).json({
        from: 'external-image-api',
        prompt: promptText,
        mime_type: contentType,
        image_base64: `data:${contentType};base64,${base64}`
      });

    } catch (e) {
      return res.status(500).json({
        error: 'Error al generar imagen desde API externa',
        details: e.message
      });
    }
  }

  // Si no es prompt de imagen, enviar la petición a Gemini

  const parts = [];

  prompts.forEach(prompt => {
    if (prompt && typeof prompt === 'string') {
      parts.push({ text: prompt });
    }
  });

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

  const payload = {
    contents: [
      ...history,
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

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA3rQorwUMGCMm-g6Bn7ewlw9qjwTpEjpE`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await geminiResponse.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Error al consultar Gemini', details: e.message });
  }
}