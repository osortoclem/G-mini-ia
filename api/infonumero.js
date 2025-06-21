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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  let body;
  try {
    body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (e) {
    return res.status(400).json({ error: "JSON inválido en el body" });
  }

  const { numeros } = body;

  if (!Array.isArray(numeros)) {
    return res.status(400).json({ error: "Envía una lista en el campo 'numeros'" });
  }

  const resultados = numeros.map(numero => {
    try {
      const parsed = parsePhoneNumber(numero);
      return {
        numero: parsed.number,
        pais: parsed.country || "Desconocido",
        nombrePais: parsed.country || "Desconocido",
        prefijo: `+${parsed.countryCallingCode}`,
        bandera: getFlagEmoji(parsed.country),
      };
    } catch {
      return {
        numero,
        error: "Número inválido o no reconocido",
      };
    }
  });

  res.status(200).json(resultados);
};