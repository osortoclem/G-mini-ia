const fetchStickersOrGifs = async (endpoint) => {
  const res = await fetch(endpoint);
  const json = await res.json();
  return json?.data || [];
};

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Falta el parámetro ?q=busqueda" });

  const API_KEY = "dc6zaTOxFJmzC";
  const base = `https://api.giphy.com/v1`;
  const params = `?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=10&rating=g`;

  try {
    let results = await fetchStickersOrGifs(`${base}/stickers/search${params}`);

    // Si no hay resultados de stickers, prueba con GIFs
    if (results.length === 0) {
      results = await fetchStickersOrGifs(`${base}/gifs/search${params}`);
    }

    const formatted = results.map((item) => ({
      id: item.id,
      title: item.title,
      type: "gif",
      url: item.images?.original?.url || "",
      source: "Giphy"
    }));

    res.status(200).json({ count: formatted.length, results: formatted });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar stickers o GIFs", details: error.message });
  }
}