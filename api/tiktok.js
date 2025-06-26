export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "URL inválida de TikTok" });
  }

  try {
    const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const json = await response.json();

    if (!json.data) {
      return res.status(500).json({ error: "No se pudo obtener información del video." });
    }

    return res.status(200).json({
      title: json.data.title,
      author: json.data.author.nickname,
      video_url: json.data.play, // o .hdplay si quieres calidad alta
      thumbnail: json.data.cover
    });
  } catch (e) {
    return res.status(500).json({ error: "Error al procesar la URL", detalle: e.message });
  }
}