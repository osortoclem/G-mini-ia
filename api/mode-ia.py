import requests
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse

app = FastAPI()

GEMINI_API_KEY = "AIzaSyA2sTaOshXI8KbPStIJNFq2hjnnbwfJdHQ"  # Reemplaza con tu clave real

# Personalidad del asistente
PERSONALIDAD = (
    "Si te preguntan tu nombre, creador u origen, responde lo siguiente: "
    "Soy un modelo de lenguaje grande y avanzado. "
    " fui creado por  Deylin, un apasionado por la tecnología. "
)

@app.get("/")
def root():
    return {"status": "API Mode-IA activa"}

@app.get("/mode-ia")
def mode_ia(prompt: str = Query(..., description="Mensaje para la IA")):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}

    data = {
        "contents": [{
            "parts": [{"text": PERSONALIDAD + prompt}]
        }]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        reply = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"response": reply}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error al comunicarse con Gemini", "details": str(e)})