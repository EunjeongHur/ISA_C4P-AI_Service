from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

# Load environment variables
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

# Headers for Hugging Face API
headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
    "Content-Type": "application/json",
}


# Endpoint for summarizing text
@app.route("/summarize-text", methods=["POST"])
def summarize_text():
    try:
        # Parse request data
        data = request.get_json()
        input_text = data.get("input")

        if not input_text:
            return jsonify({"error": "Missing 'input' in request"}), 400

        # Call Hugging Face API for summarization
        api_url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
        response = requests.post(api_url, headers=headers, json={"inputs": input_text})
        response.raise_for_status()  # Raise an error for bad status codes

        # Extract and return the summary
        summary = response.json()[0].get("summary_text")
        return jsonify({"summary": summary})

    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {e}")
        return jsonify({"error": "Failed to generate summary"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5001)))
