async function translateText() {
    const text = document.getElementById("text").value;
    const language = document.querySelector('input[name="language"]:checked').value;

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language })
        });

        const data = await response.json();
        if (data.translation) {
            document.getElementById("output").innerText = data.translation;
        } else {
            throw new Error("Invalid response from backend");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Translation failed.");
    }
}
