🛡️ AI-Powered Phishing Detection and Analysis Tool

 📌 Description

This tool analyzes emails and URLs to detect phishing attempts using heuristic rules and signature-based detection. It helps reduce the risk of social engineering attacks by flagging suspicious content before users interact with it.

 🔍 Key Features

- Email Analysis – Checks sender info, headers, and message content for phishing indicators.
- URL Scanning – Detects:
  - Typosquatting (e.g., g00gle.com)
  - Shortened/obfuscated links
  - Known phishing domains
- Heuristic Engine – Uses logic-based rules to detect suspicious behavior without relying on signatures alone.
- Signature Matching – Cross-references known phishing URLs from sources like PhishTank.
- IOC Extraction – Extracts indicators of compromise (IPs, domains, payload links).
- Modular Design – Can run standalone or plug into larger security pipelines.

 💡 Why It’s Different

Most phishing tools are heavy, API-dependent, or ignore local/regional threats. Ours is:

- Lightweight and fast 
- Customizable for specific phishing threats (e.g., local banks, telecom)
- Beginner-friendly but expandable for advanced use cases
- Designed for real-world training, not just detection

 🛠 Tech Stack

- Python
- Regex and rule-based logic
- WHOIS and DNS lookups
- Public threat intel feeds (e.g., PhishTank, OpenPhish)

 🚧 Roadmap

- [ ] Machine learning phishing classifier (optional module)
- [ ] GUI for non-technical users
- [ ] Real-time scanning mode
- [ ] Email training simulations

 🤝 Credits

Developed by Group31 as part of a real-world cybersecurity project.

📜 License

MIT License
---


## ✨ Features
- 🔍 **Heuristic Detection** — Suspicious keywords, domains, and insecure links
- 🤖 **Groq AI Integration** — Short, accurate phishing verdicts in 3 lines
- 📊 **Visual Score** — Progress bar showing site safety
- 🖥️ **Web Interface** — Run locally in your browser


---
<img width="1366" height="704" alt="Screenshot_2025-08-09_05_23_11" src="https://github.com/user-attachments/assets/2bb8040f-5bd3-4c2c-91f0-a5916b54db6f" />


## 📦 Installation


```bash
git clone https://github.com/Animhassen/phishing_tool.git
cd phishing-detector

            #On Kali Linux / Debian-based Linux

sudo apt update
sudo apt install python3 python3-pip -y
pip3 install -r requirements.txt

            #on windows

git clone https://github.com/YOUR_USERNAME/phishing-tool.git
cd phishing-tool
pip install -r requirements.txt


            #Set your Groq API key

Create a .env file in the folder:
and accese the grock website link https://groq.com/

and add like this on your api key
    GROQ_API_KEY=your_groq_api_key_here
and save it as .env file 

        #▶️ Running the Application
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












