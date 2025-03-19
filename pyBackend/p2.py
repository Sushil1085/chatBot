from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from bot import get_query_response, load_query_data
import nltk


app = Flask(__name__)
CORS(app)

# Load dataset safely
DATASET_PATH = "pyBackend/thermax_detailed_dataset.csv"
if os.path.exists(DATASET_PATH):
    query_df = load_query_data(DATASET_PATH)
    print("✅ Dataset loaded successfully.")
else:
    query_df = None
    print("❌ Error: Dataset file not found!")

@app.route("/ask", methods=["GET"])
def ask_question():
    user_input = request.args.get("question", "").strip()

    # Handle empty question
    if not user_input:
        return jsonify({"error": "Invalid input. Please provide a question."}), 400
    
    # Handle missing dataset
    if query_df is None:
        return jsonify({"error": "Dataset not loaded. Please check thermax_detailed_dataset.csv"}), 500
    
    # Process query
    response = get_query_response(user_input, query_df)
    
    # Handle case where no relevant answer is found
    if not response or response.get("response") == "Sorry, I couldn't find relevant information.":
        return jsonify({"response": "No relevant data found in the dataset."}), 200
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
