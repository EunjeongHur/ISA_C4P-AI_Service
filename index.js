const express = require('express');
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const app = express();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.use(express.json());

// Endpoint for generating a legal response
app.post('/generate-legal-response', async (req, res) => {
    try {
        const { input } = req.body;

        // Interact with the Hugging Face model
        const result = await hf.textGeneration({
            model: "Merdeka-LLM/merdeka-llm-lawyer-3b-128k-instruct",
            inputs: input,
            parameters: { max_new_tokens: 50 },
        });

        // Send the model's response back to the client
        res.status(200).json({ response: result.generated_text });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// Endpoint for summarizing text
app.post('/summarize-text', async (req, res) => {
    try {
        const { input } = req.body;

        // Interact with the Hugging Face model for summarization
        const result = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: input,
        });

        // Send the summary back to the client
        res.status(200).json({ summary: result.summary_text });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`AI service running on port ${PORT}`));
