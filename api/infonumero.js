const { parsePhoneNumber } = require("libphonenumber-js");

function getFlagEmoji(countryCode) {
  if (!countryCode) return null;
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { numero } = req.query;

  if (!numero) {
    return res.status(400).json({ error: "Parámetro 'numero' requerido" });
  }

  try {
    const parsed = parsePhoneNumber(numero);

    res.json({
      numero: parsed.number,
      pais: parsed.country || "Desconocido",
      nombrePais: parsed.country || "Desconocido",
      prefijo: `+${parsed.countryCallingCode}`,
      bandera: getFlagEmoji(parsed.country),
    });
  } catch (err) {
    res.status(400).json({ error: "Número inválido o no reconocido" });
  }
};