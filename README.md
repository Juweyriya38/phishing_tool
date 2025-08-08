# phishing_tool

==============================
README.md
==============================
# 🛡️ AI-Powered Phishing Detector

![Phishing Detector Banner](https://i.imgur.com/tYqZ5oY.png)

An advanced **AI + heuristic-based phishing detection tool** for analyzing URLs and text messages.  
Built with **Flask**, **Groq AI API**, and a **custom rule-based engine**, it detects potential phishing threats and gives a confidence score.

---

## ✨ Features
- 🔍 **Heuristic Detection** — Suspicious keywords, domains, and insecure links
- 🤖 **Groq AI Integration** — Short, accurate phishing verdicts in 3 lines
- 📊 **Visual Score** — Progress bar showing site safety
- 🖥️ **Web Interface** — Run locally in your browser
- ⛔ **Blocked Domain Detection** — Immediate 100% phishing score if critical domains are found

---

## 📦 Installation

### **1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/phishing-detector.git
cd phishing-detector

            On Kali Linux / Debian-based Linux

sudo apt update
sudo apt install python3 python3-pip -y
pip3 install -r requirements.txt

            on windows

git clone https://github.com/YOUR_USERNAME/phishing-detector.git
cd phishing-detector
pip install -r requirements.txt


            Set your Groq API key
Create a .env file in the folder:
and accese the grock website link 
            https://groq.com/
and add like this on your api key
    GROQ_API_KEY=your_groq_api_key_here
and save it as .env file 


        ▶️ Running the Application
On Kali Linux
python3 app.py

on windows
python app.py

now open browser and navigate 

    http://127.0.0.1:5000






                    project structure 

phishing-detector/
│   app.py                # Main Flask app
│   detector.py           # Heuristic phishing detection
│   groq_ai_detector.py   # AI-based phishing analysis
│   requirements.txt      # Python dependencies
│   .env                  # Groq API key
│
└── templates/
    │   index.html        # Input form
    │   result.html       # Result display page

