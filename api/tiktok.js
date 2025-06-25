export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro 'url'" });
  }

  try {
    const apiUrl = `https://api.tikwm.com/video/info?url=${encodeURIComponent(url)}`;

    const respuesta = await fetch(apiUrl);
    const data = await respuesta.json();

    if (data.code !== 0) {
      return res.status(500).json({ error: "No se pudo obtener la información" });
    }

    return res.status(200).json({
      title: data.data.title,
      author: data.data.author.nickname,
      video_url: data.data.play,
      thumbnail: data.data.cover
    });
  } catch (e) {
    return res.status(500).json({ error: "Error interno", detalle: e.message });
  }
}