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
  'AD': 'Andorra',
  'AE': 'Emiratos Árabes Unidos',
  'AF': 'Afganistán',
  'AG': 'Antigua y Barbuda',
  'AI': 'Anguila',
  'AL': 'Albania',
  'AM': 'Armenia',
  'AO': 'Angola',
  'AQ': 'Antártida',
  'AR': 'Argentina',
  'AS': 'Samoa Americana',
  'AT': 'Austria',
  'AU': 'Australia',
  'AW': 'Aruba',
  'AX': 'Islas Åland',
  'AZ': 'Azerbaiyán',
  'BA': 'Bosnia y Herzegovina',
  'BB': 'Barbados',
  'BD': 'Bangladés',
  'BE': 'Bélgica',
  'BF': 'Burkina Faso',
  'BG': 'Bulgaria',
  'BH': 'Baréin',
  'BI': 'Burundi',
  'BJ': 'Benín',
  'BL': 'San Bartolomé',
  'BM': 'Bermudas',
  'BN': 'Brunéi',
  'BO': 'Bolivia',
  'BQ': 'Bonaire, San Eustaquio y Saba',
  'BR': 'Brasil',
  'BS': 'Bahamas',
  'BT': 'Bután',
  'BV': 'Isla Bouvet',
  'BW': 'Botsuana',
  'BY': 'Bielorrusia',
  'BZ': 'Belice',
  'CA': 'Canadá',
  'CC': 'Islas Cocos',
  'CD': 'Congo (República Democrática del)',
  'CF': 'República Centroafricana',
  'CG': 'Congo',
  'CH': 'Suiza',
  'CI': 'Costa de Marfil',
  'CK': 'Islas Cook',
  'CL': 'Chile',
  'CM': 'Camerún',
  'CN': 'China',
  'CO': 'Colombia',
  'CR': 'Costa Rica',
  'CU': 'Cuba',
  'CV': 'Cabo Verde',
  'CW': 'Curazao',
  'CX': 'Isla de Navidad',
  'CY': 'Chipre',
  'CZ': 'República Checa',
  'DE': 'Alemania',
  'DJ': 'Yibuti',
  'DK': 'Dinamarca',
  'DM': 'Dominica',
  'DO': 'República Dominicana',
  'DZ': 'Argelia',
  'EC': 'Ecuador',
  'EE': 'Estonia',
  'EG': 'Egipto',
  'EH': 'Sahara Occidental',
  'ER': 'Eritrea',
  'ES': 'España',
  'ET': 'Etiopía',
  'FI': 'Finlandia',
  'FJ': 'Fiyi',
  'FK': 'Islas Malvinas',
  'FM': 'Micronesia',
  'FO': 'Islas Feroe',
  'FR': 'Francia',
  'GA': 'Gabón',
  'GB': 'Reino Unido',
  'GD': 'Granada',
  'GE': 'Georgia',
  'GF': 'Guayana Francesa',
  'GG': 'Guernsey',
  'GH': 'Ghana',
  'GI': 'Gibraltar',
  'GL': 'Groenlandia',
  'GM': 'Gambia',
  'GN': 'Guinea',
  'GP': 'Guadalupe',
  'GQ': 'Guinea Ecuatorial',
  'GR': 'Grecia',
  'GS': 'Islas Georgias del Sur y Sandwich del Sur',
  'GT': 'Guatemala',
  'GU': 'Guam',
  'GW': 'Guinea-Bisáu',
  'GY': 'Guyana',
  'HK': 'Hong Kong',
  'HM': 'Islas Heard y McDonald',
  'HN': 'Honduras',
  'HR': 'Croacia',
  'HT': 'Haití',
  'HU': 'Hungría',
  'ID': 'Indonesia',
  'IE': 'Irlanda',
  'IL': 'Israel',
  'IM': 'Isla de Man',
  'IN': 'India',
  'IO': 'Territorio Británico del Océano Índico',
  'IQ': 'Irak',
  'IR': 'Irán',
  'IS': 'Islandia',
  'IT': 'Italia',
  'JE': 'Jersey',
  'JM': 'Jamaica',
  'JO': 'Jordania',
  'JP': 'Japón',
  'KE': 'Kenia',
  'KG': 'Kirguistán',
  'KH': 'Camboya',
  'KI': 'Kiribati',
  'KM': 'Comoras',
  'KN': 'San Cristóbal y Nieves',
  'KP': 'Corea del Norte',
  'KR': 'Corea del Sur',
  'KW': 'Kuwait',
  'KY': 'Islas Caimán',
  'KZ': 'Kazajistán',
  'LA': 'Laos',
  'LB': 'Líbano',
  'LC': 'Santa Lucía',
  'LI': 'Liechtenstein',
  'LK': 'Sri Lanka',
  'LR': 'Liberia',
  'LS': 'Lesoto',
  'LT': 'Lituania',
  'LU': 'Luxemburgo',
  'LV': 'Letonia',
  'LY': 'Libia',
  'MA': 'Marruecos',
  'MC': 'Mónaco',
  'MD': 'Moldavia',
  'ME': 'Montenegro',
  'MF': 'San Martín (parte francesa)',
  'MG': 'Madagascar',
  'MH': 'Islas Marshall',
  'MK': 'Macedonia del Norte',
  'ML': 'Malí',
  'MM': 'Birmania',
  'MN': 'Mongolia',
  'MO': 'Macao',
  'MP': 'Islas Marianas del Norte',
  'MQ': 'Martinica',
  'MR': 'Mauritania',
  'MS': 'Montserrat',
  'MT': 'Malta',
  'MU': 'Mauricio',
  'MV': 'Maldivas',
  'MW': 'Malaui',
  'MX': 'México',
  'MY': 'Malasia',
  'MZ': 'Mozambique',
  'NA': 'Namibia',
  'NC': 'Nueva Caledonia',
  'NE': 'Níger',
  'NF': 'Isla Norfolk',
  'NG': 'Nigeria',
  'NI': 'Nicaragua',
  'NL': 'Países Bajos',
  'NO': 'Noruega',
  'NP': 'Nepal',
  'NR': 'Nauru',
  'NU': 'Niue',
  'NZ': 'Nueva Zelanda',
  'OM': 'Omán',
  'PA': 'Panamá',
  'PE': 'Perú',
  'PF': 'Polinesia Francesa',
  'PG': 'Papúa Nueva Guinea',
  'PH': 'Filipinas',
  'PK': 'Pakistán',
  'PL': 'Polonia',
  'PM': 'San Pedro y Miquelón',
  'PN': 'Islas Pitcairn',
  'PR': 'Puerto Rico',
  'PS': 'Palestina',
  'PT': 'Portugal',
  'PW': 'Palaos',
  'PY': 'Paraguay',
  'QA': 'Catar',
  'RE': 'Reunión',
  'RO': 'Rumania',
  'RS': 'Serbia',
  'RU': 'Rusia',
  'RW': 'Ruanda',
  'SA': 'Arabia Saudita',
  'SB': 'Islas Salomón',
  'SC': 'Seychelles',
  'SD': 'Sudán',
  'SE': 'Suecia',
  'SG': 'Singapur',
  'SH': 'Santa Elena, Ascensión y Tristán de Acuña',
  'SI': 'Eslovenia',
  'SJ': 'Svalbard y Jan Mayen',
  'SK': 'Eslovaquia',
  'SL': 'Sierra Leona',
  'SM': 'San Marino',
  'SN': 'Senegal',
  'SO': 'Somalia',
  'SR': 'Surinam',
  'SS': 'Sudán del Sur',
  'ST': 'Santo Tomé y Príncipe',
  'SV': 'El Salvador',
  'SX': 'San Martín (parte holandesa)',
  'SY': 'Siria',
  'SZ': 'Suazilandia',
  'TC': 'Islas Turcas y Caicos',
  'TD': 'Chad',
  'TF': 'Territorios Australes Franceses',
  'TG': 'Togo',
  'TH': 'Tailandia',
  'TJ': 'Tayikistán',
  'TK': 'Tokelau',
  'TL': 'Timor Oriental',
  'TM': 'Turkmenistán',
  'TN': 'Túnez',
  'TO': 'Tonga',
  'TR': 'Turquía',
  'TT': 'Trinidad y Tobago',
  'TV': 'Tuvalu',
  'TW': 'Taiwán',
  'TZ': 'Tanzania',
  'UA': 'Ucrania',
  'UG': 'Uganda',
  'UM': 'Islas Ultramarinas Menores de Estados Unidos',
  'US': 'Estados Unidos',
  'UY': 'Uruguay',
  'UZ': 'Uzbekistán',
  'VA': 'Ciudad del Vaticano',
  'VC': 'San Vicente y las Granadinas',
  'VE': 'Venezuela',
  'VG': 'Islas Vírgenes Británicas',
  'VI': 'Islas Vírgenes de los Estados Unidos',
  'VN': 'Vietnam',
  'VU': 'Vanuatu',
  'WF': 'Wallis y Futuna',
  'WS': 'Samoa',
  'YE': 'Yemen',
  'YT': 'Mayotte',
  'ZA': 'Sudáfrica',
  'ZM': 'Zambia',
  'ZW': 'Zimbabue'
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