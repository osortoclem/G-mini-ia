export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Falta el parámetro ?q=busqueda" });

  try {
    const response = await fetch(`https://api.sticker.ly/v2/packs/search?query=${encodeURIComponent(q)}&language=es`);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Respuesta inesperada", raw: data });
    }

    const packs = await Promise.all(
      data.data.slice(0, 5).map(async (pack) => {
        const packRes = await fetch(`https://api.sticker.ly/v2/packs/${pack.pack_id}`);
        const packData = await packRes.json();

        return {
          pack_id: pack.pack_id,
          title: pack.title,
          author: packData.author?.username || "Desconocido",
          stickers: packData.stickers?.map((sticker) => ({
            id: sticker.id,
            url: sticker.image_url
          })) || []
        };
      })
    );

    res.status(200).json({ count: packs.length, results: packs });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos de Sticker.ly", details: error.message });
  }
}