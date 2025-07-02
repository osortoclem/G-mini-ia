export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Falta el parámetro ?q=busqueda" });

  const API_KEY = "dc6zaTOxFJmzC"; // clave pública de GIPHY

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=10&rating=g`
    );
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Respuesta inesperada", raw: data });
    }

    const stickers = data.data.map((item) => ({
      id: item.id,
      title: item.title,
      type: "gif",
      url: item.images?.original?.url || "",
      source: "Giphy"
    }));

    res.status(200).json({ count: stickers.length, results: stickers });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar los stickers", details: error.message });
  }
}