import re, requests
from bs4 import BeautifulSoup
import tldextract
#modules must be imported pip install beautifulsoup4 requests tldextract scikit-learn pandas
PHISHING_SIGNATURES = ["login.verify.com", "secure-update.com", "bit.ly"]

def is_suspicious_url(url):
    score = 0
    if re.match(r"http[s]?://\d{1,3}(\.\d{1,3}){3}", url):
        score += 2
    if "@" in url or url.count(".") > 5:
        score += 1
    if len(url) > 75:
        score += 1
    if any(phish in url for phish in PHISHING_SIGNATURES):
        return True
    return score >= 2

def analyze_html_for_phishing(html):
    soup = BeautifulSoup(html, 'html.parser')
    suspicious_forms = soup.find_all('form', action=True)
    hidden_inputs = soup.find_all('input', type='hidden')
    iframes = soup.find_all('iframe')
    score = 0
    if suspicious_forms:
        score += 1
    if hidden_inputs:
        score += 1
    if iframes:
        score += 1
    return score >= 2

def check_url(url):
    try:
        response = requests.get(url, timeout=10)
        if is_suspicious_url(url) or analyze_html_for_phishing(response.text):
            print(f"[!] Warning: Phishing detected at {url}")
        else:
            print(f"[✓] {url} appears safe.")
    except:
        print(f"[x] Failed to reach {url}")

# Test
check_url("http://bit.ly/3FakePhishURL")
