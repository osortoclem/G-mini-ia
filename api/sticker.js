export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Falta el parámetro ?q=tu_busqueda" });
  }

  const TENOR_API_KEY = "LIVDSRZULELA"; // clave pública de prueba de Tenor

  try {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${TENOR_API_KEY}&limit=10&media_filter=gif,tinygif,mediumgif,mp4`
    );

    const data = await response.json();

    const stickers = data.results.map((item) => {
      const media = item.media_formats;

      return {
        id: item.id,
        title: item.content_description || "Sticker",
        type: media.mp4 ? "video" : media.gif ? "gif" : "image",
        url: media.mp4?.url || media.gif?.url || media.tinygif?.url,
        source: "Tenor"
      };
    });

    res.status(200).json({ count: stickers.length, results: stickers });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar los stickers", details: error.message });
  }
}