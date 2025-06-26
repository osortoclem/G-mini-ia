// api/facebook.js
import { igdl } from 'ruhend-scraper';

export default async function handler(req, res) {
  const url = req.query.url;

  if (!url || !url.includes('facebook.com')) {
    return res.status(400).json({ error: 'Debes proporcionar una URL válida de Facebook.' });
  }

  try {
    const response = await igdl(url);

    if (!response || !response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron resultados para el enlace proporcionado.' });
    }

    // Simplemente devolver toda la respuesta que da la librería
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error al procesar el video de Facebook:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar el video.' });
  }
}