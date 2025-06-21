import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Función para convertir código país ISO (ej. "US") a emoji bandera
function countryCodeToEmoji(countryCode) {
  // A-Z Unicode Regional Indicator Symbols empiezan en 0x1F1E6
  const OFFSET = 0x1F1E6 - 'A'.charCodeAt(0);
  const chars = [...countryCode.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + OFFSET));
  return chars.join('');
}

// Mapeo básico de países (puedes ampliarlo o usar una librería)
const countryNames = {
  US: 'Estados Unidos',
  MX: 'México',
  ES: 'España',
  CO: 'Colombia',
  // ... agrega más si quieres
};

export default function handler(req, res) {
  // Solo GET y POST
  if (req.method === 'GET') {
    const numero = req.query.numero;
    if (!numero) {
      return res.status(400).json({ error: 'Parámetro "numero" es requerido' });
    }
    const result = processNumber(numero);
    return res.json(result);
  } else if (req.method === 'POST') {
    const { numeros } = req.body;
    if (!Array.isArray(numeros)) {
      return res.status(400).json({ error: 'El cuerpo debe contener un array "numeros"' });
    }
    const results = numeros.map(processNumber);
    return res.json(results);
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}

function processNumber(numero) {
  try {
    // Quitar espacios
    const cleanNumber = numero.trim();

    // Asegurarnos que empiece con '+' para formato internacional
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : `+${cleanNumber}`;

    const phoneNumber = parsePhoneNumberFromString(formattedNumber);

    if (!phoneNumber || !phoneNumber.country) {
      return { numero, error: 'Número inválido o país no reconocido' };
    }

    const countryCode = phoneNumber.country; // ej. "HN"
    const emoji = countryCodeToEmoji(countryCode);
    const countryName = countryNames[countryCode] || 'Desconocido';

    return {
      numero,
      pais: countryName,
      bandera: emoji
    };
  } catch (e) {
    return { numero, error: 'Error al procesar número' };
  }
}