from flask import Flask, render_template, request
from detector import analyze_input
from groq_ai_detector import ai_analyze

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    url = request.form.get("url", "").strip()
    text = request.form.get("text", "").strip()

    heuristic_result = analyze_input(url, text)
    ai_result = ai_analyze(url, text)

    # Final decision: if either says phishing, it's phishing
    final_suspicious = heuristic_result["is_suspicious"] or ("phishing" in ai_result.lower())
    heuristic_result["is_suspicious"] = final_suspicious

    return render_template("result.html", result=heuristic_result, ai_result=ai_result)

if __name__ == "__main__":
    app.run(debug=True)
