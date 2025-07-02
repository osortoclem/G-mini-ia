export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Falta el parámetro ?q=tu_busqueda" });
  }

  const TENOR_OLD_API_KEY = "LIVDSRZULELA"; // Esta sí sirve en el endpoint anterior

  try {
    const response = await fetch(
      `https://g.tenor.com/v1/search?q=${encodeURIComponent(q)}&key=${TENOR_OLD_API_KEY}&limit=10`
    );

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return res.status(500).json({
        error: "Respuesta inesperada de Tenor (v1)",
        response: data
      });
    }

    const stickers = data.results.map((item) => {
      const media = item.media?.[0] || {};

      return {
        id: item.id,
        title: item.title || "Sticker",
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