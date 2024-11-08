const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// External URL
const externalUrl = "https://d68e-2604-3d08-7380-17e0-247f-10fb-7e5c-ba5e.ngrok-free.app";

// Endpoint to accept text from the client
app.post('/process-text', async (req, res) => {
    try {
        const { text } = req.body;

        // Validate the input
        if (!text) {
            return res.status(400).json({ error: "Text parameter is required" });
        }

        // Send POST request to the external URL
        const response = await axios.post(externalUrl, { text });

        // Return the response from the external service
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Failed to process the request" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
