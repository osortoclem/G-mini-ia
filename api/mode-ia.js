import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = "AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ"; 
// Personalidad del asistente
const PERSONALIDAD = 
  "Si te preguntan tu nombre, creador u origen, responde lo siguiente: " +
  "Fui desarrollado por Mode API con herramientas de Google. " +
  "Soy un modelo de lenguaje grande y avanzado. " +
  "El creador de Mode API es Deylin, un apasionado por la tecnología y la IA. ";

// Estructura simple para almacenar conversaciones en memoria (ojo: no es persistente)
const conversaciones = {};

/**
 * Guarda un mensaje en el historial de conversaciones por id de usuario/chat.
 * @param {string} id - Identificador del usuario o chat
 * @param {string} mensaje - Texto enviado o recibido
 * @param {"usuario"|"bot"} quien - Quién envió el mensaje
 */
function guardarConversacion(id, mensaje, quien) {
  if (!conversaciones[id]) {
    conversaciones[id] = [];
  }
  conversaciones[id].push({ quien, mensaje, fecha: new Date().toISOString() });
}

app.get("/", (req, res) => {
  res.json({ status: "API Mode-IA activa" });
});

app.get("/mode-ia", async (req, res) => {
  const prompt = req.query.prompt;
  const chatId = req.query.chatId || "anon"; // Puedes mandar un id para guardar conversación

  if (!prompt) {
    return res.status(400).json({ error: "El parámetro 'prompt' es obligatorio." });
  }

  // Guardar pregunta del usuario
  guardarConversacion(chatId, prompt, "usuario");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const data = {
      contents: [{
        parts: [{ text: PERSONALIDAD + prompt }]
      }]
    };

    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se obtuvo respuesta.";

    // Guardar respuesta del bot
    guardarConversacion(chatId, reply, "bot");

    res.json({ response: reply, conversation: conversaciones[chatId] });
  } catch (error) {
    res.status(500).json({
      error: "Error al comunicarse con Gemini",
      details: error.toString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`API Mode-IA corriendo en puerto ${PORT}`);
});