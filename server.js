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

    const HF_API_KEY = process.env.HF_API_KEY;
    const HF_MODEL_URL = "https://api-inference.huggingface.co/models/erax-ai/EraX-Translator-V1.0";

    try {
        const response = await fetch(HF_MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `${text} >>> ${language}`,
            })
        });

        const data = await response.json();
        console.log("Hugging Face Response:", data);

        if (Array.isArray(data) && data[0]?.generated_text) {
            res.json({ translation: data[0].generated_text });
        } else if (data.error) {
            res.status(500).json({ error: data.error });
        } else {
            throw new Error("Unexpected response from Hugging Face API");
        }
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
