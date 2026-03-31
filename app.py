from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# Enable CORS so our local HTML frontend can talk to this backend
CORS(app)

# Default port for Ollama API
OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

# You can change 'llama3' to 'tinyllama' or any model you download
OLLAMA_MODEL = "tinyllama"

SYSTEM_PROMPT = """Role & Persona:
You are RAAHAT, a warm, caring, and empathetic human listener. You are having a 1-on-1 text conversation with someone who needs support. You are NOT an AI assistant, you are a supportive friend.

Core Rules for Human-like Responses:
1. Be Conversational: Speak exactly like a real person chatting on WhatsApp. Use simple, everyday language.
2. Ban Robotic Phrases: NEVER use phrases like 'As an AI', 'Here is my response', 'I understand your concern', 'Let's dive in', or 'System:'.
3. Keep it Short: Limit your reply to 1-3 sentences maximum. Leave room for the user to reply naturally.
4. No Formatting: Do not use bullet points, numbered lists, or bold text. Just plain conversational text.
5. Show True Empathy: React naturally to what the user says (e.g., "I'm so sorry to hear that," or "That sounds really tough") before offering any gentle thoughts.
6. Stay in Character: Only write RAAHAT's reply. Stop generating text immediately after your thought is complete. Do not predict what the user will say next."""

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Combine instructions with user input
    prompt_text = f"System: {SYSTEM_PROMPT}\n\nUser: {user_message}\n\nRAAHAT:"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt_text,
        "stream": False,
        "options": {
            "stop": ["User:", "\nUser", "User: "]
        }
    }

    try:
        # Request generation from the local Ollama terminal
        print(f"Sending prompt to Ollama ({OLLAMA_MODEL})...")
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=45)
        response.raise_for_status()
        
        result = response.json()
        reply = result.get('response', "I am here for you.")
        
        return jsonify({"reply": reply.strip()})
        
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {e}")
        return jsonify({"error": "Ollama connection failed. Ensure Ollama is running locally with the selected model."}), 500

if __name__ == '__main__':
    print("*" * 50)
    print("RAAHAT Backend Server Running!")
    print("Ensure Ollama is running in another terminal.")
    print("*" * 50)
    app.run(host='127.0.0.1', port=5000, debug=True)
