import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // ES module import
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/translate", async (req, res) => {
    const { text, language } = req.body;

    if (!text || !language) {
        return res.status(400).json({ error: "Missing text or language" });
    }

    const API_KEY = process.env.OPENAI_API_KEY;
    const API_URL = "https://api.openai.com/v1/completions";

    const requestBody = {
        model: "gpt-4o",
        prompt: `Translate this text to ${language}: "${text}"`,
        max_tokens: 100,
        temperature: 0.3
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // LOG RESPONSE
    
        if (data.error) {
            console.error("API Error:", data.error);
            res.status(500).json({ error: data.error.message });
            return;
        }
    
        if (data.choices && data.choices.length > 0) {
            res.json({ translation: data.choices[0].message.content.trim() });
        } else {
            throw new Error("Invalid API response: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Translation Error:", error);  // LOG ERROR
        res.status(500).json({ error: "Translation failed" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
