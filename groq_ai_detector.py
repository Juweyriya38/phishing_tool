import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ai_analyze(url, text):
    prompt = f"""
    You are a phishing detection AI. Analyze this input and respond in max 3 lines.

    URL: {url}
    TEXT: {text}

    Rules:
    - If phishing, start with "🚨 This is phishing" and list 2-4 reasons.
    - If not phishing, say "✅ Not phishing" and state how well-known the site is (% known).
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=150
    )

    return response.choices[0].message.content.strip()
