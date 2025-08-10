async function analyzeContent() {
    const url = document.getElementById("url").value;
    const text = document.getElementById("text").value;
    const resultContainer = document.getElementById("result-container");

    resultContainer.classList.add("hidden");
    resultContainer.innerHTML = "";

    const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, text })
    });

    const data = await response.json();

    if (data.error) {
        resultContainer.className = "mt-8 p-6 rounded-lg bg-red-100 border-l-4 border-red-600";
        resultContainer.innerHTML = `<h3 class="text-red-700 font-bold">Error</h3><p>${data.error}</p>`;
    } else if (data.is_phishing) {
        resultContainer.className = "mt-8 p-6 rounded-lg bg-gradient-to-r from-red-500 to-orange-400 text-white";
        resultContainer.innerHTML = `<h3 class="text-2xl font-bold">🚨 Phishing Detected!</h3><p>${data.reason}</p>`;
    } else {
        resultContainer.className = "mt-8 p-6 rounded-lg bg-gradient-to-r from-green-500 to-green-300 text-white";
        resultContainer.innerHTML = `<h3 class="text-2xl font-bold">✅ Safe</h3><p>${data.reason}</p>`;
    }

    resultContainer.classList.remove("hidden");
}
