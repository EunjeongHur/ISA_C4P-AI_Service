const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// External URL
const externalUrl = "https://8a67-2604-3d08-7380-17e0-851c-2e0b-880f-90ee.ngrok-free.app";

// Endpoint to accept text from the client
app.post('/process-text', async (req, res) => {
    try {
        const { input } = req.body;

        // Validate the input
        if (!input) {
            return res.status(400).json({ error: "Input is required" });
        }

        // Send POST request to the external URL
        const response = await axios.post(externalUrl, { input });

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
