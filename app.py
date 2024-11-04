from flask import Flask, request, jsonify
from transformers import BartForConditionalGeneration, BartTokenizer
import torch

app = Flask(__name__)

# Load model and tokenizer once during startup
model_name = "facebook/bart-large-cnn"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

@app.route("/summarize", methods=["POST"])
def summarize_text():
    try:
        # Validate incoming JSON data
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()

        # Check if input text is provided
        input_text = data.get("text")
        if not input_text:
            return jsonify({"error": "Missing 'text' in request"}), 400

        # Tokenize and summarize text
        inputs = tokenizer(input_text, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(inputs["input_ids"], max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)

        # Decode summarized text
        summarized_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return jsonify({"summary": summarized_text})

    except Exception as e:
        # Handle exceptions and return a meaningful error response
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
