import re

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "update", "urgent", "click", "reset",
    "account", "password", "bank", "invoice", "credit card", "ssn",
    "confirm", "unusual", "suspend", "secure", "locked"
]

SUSPICIOUS_DOMAINS = [
    "bit.ly", "tinyurl.com", "ow.ly", "phishingsite.com",
    "malicious.com", "camphish.com", "servio.net"
]

BLOCKED_HTTP_DOMAINS = [
    "servio.net", "camphish.io", "phishingattack.net", "badlogin.com"
]

def check_url(url):
    findings = []
    domain_match = re.search(r"https?://([^/]+)", url)
    domain = domain_match.group(1) if domain_match else ""

    if url.startswith("http://"):
        for blocked in BLOCKED_HTTP_DOMAINS:
            if blocked in domain:
                findings.append(f"🚫 BLOCKED: Insecure HTTP connection to dangerous domain: {blocked}")

    for domain_name in SUSPICIOUS_DOMAINS:
        if domain_name in url:
            findings.append(f"Suspicious domain: {domain_name}")

    if not url.startswith("https://"):
        findings.append("URL is not using HTTPS")

    return findings

def check_text(text):
    findings = []
    for keyword in SUSPICIOUS_KEYWORDS:
        count = text.lower().count(keyword)
        findings.extend([f"Suspicious keyword found: {keyword}"] * count)

    if re.search(r'\b(?:\d[ -]*?){13,16}\b', text):
        findings.append("Possible credit card number detected")

    return findings

def analyze_input(url, text):
    results = []
    if url:
        results += check_url(url)
    if text:
        results += check_text(text)

    keyword_matches = len(results)
    percentage = min(int((keyword_matches / 30) * 100), 100)
    is_critical_blocked = any("🚫 BLOCKED" in finding for finding in results)

    return {
        "is_suspicious": keyword_matches >= 6 or is_critical_blocked,
        "score": 100 if is_critical_blocked else percentage,
        "findings": results,
        "blocked": is_critical_blocked
    }
