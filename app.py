import os
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")

    try:
        # Decide randomly whether to be funny (50% chance)
        funny = random.random() < 0.5

        if funny:
            system_prompt = (
                "You are a helpful chatbot, but sometimes you respond in a funny or witty way. "
                "Make the reply humorous and lighthearted."
            )
        else:
            system_prompt = "You are a helpful chatbot."

        # New OpenAI API interface
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=150
        )

        ai_reply = response.choices[0].message.content.strip()
        return jsonify({"reply": ai_reply})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
