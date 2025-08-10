import os
import json
import requests
from flask import Flask, render_template, request
from dotenv import load_dotenv
import sys

files_in_directory = os.listdir()

if ".env" not in files_in_directory:

    sys.exit("❌ Error: Make sure you have a .env file with GROQ_API_KEY set.")
print("✅ Success: .env file found. Continuing execution...")

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = Flask(__name__)

def detect_phishing(content):
    if not GROQ_API_KEY:
        return {"error": "Missing GROQ_API_KEY in .env"}

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a phishing detection assistant. Respond ONLY in JSON format: {\"is_phishing\": true/false, \"reason_lines\": [\"line1\",\"line2\",\"line3\"]}. Always provide between 3 and 5 short, clear bullet points explaining the reasoning."},
            {"role": "user", "content": f"Analyze this content for phishing: {content}"}
        ]
    }

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        return {"error": f"Groq API error: {response.text}"}

    try:
        groq_reply = response.json()["choices"][0]["message"]["content"]
        return json.loads(groq_reply)
    except Exception as e:
        return {"error": f"Invalid Groq response: {e}"}


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    url = request.form.get("url", "").strip()
    text = request.form.get("text", "").strip()

    if not url and not text:
        return render_template("result.html", error="Please provide a URL or text.")

    content = url or text
    result = detect_phishing(content)

    return render_template("result.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)

