import { parsePhoneNumber } from "libphonenumber-js";

function getFlagEmoji(countryCode) {
  if (!countryCode) return null;
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default async function handler(req, res) {
  // ✅ Habilitar CORS para todos los dominios
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Manejar preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { numeros } = req.body;

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

  res.json(resultados);
}