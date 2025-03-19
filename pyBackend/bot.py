import nltk
import pandas as pd
import random
from flask import Flask, request, jsonify
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

# Download required NLTK resources
nltk.download('punket_tab')
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Load stopwords
stop_words = set(stopwords.words('english'))

# Function to get synonyms using WordNet
def get_synonyms(word):
    synonyms = set()
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().replace('_', ' '))  # Convert underscores to spaces
    return synonyms

# Function to clean and preprocess text
def preprocess(text):
    words = word_tokenize(text.lower())  # Tokenization & Lowercasing
    words = [word for word in words if word.isalnum() and word not in stop_words]  # Remove stopwords & punctuation
    expanded_words = []
    for word in words:
        expanded_words.extend(get_synonyms(word))  # Add synonyms for better matching
    return " ".join(expanded_words) if expanded_words else " ".join(words)

# Function to load and preprocess query data from a CSV file
def load_query_data(file_path):
    try:
        df = pd.read_csv(file_path)
        if "Query" not in df.columns:
            print("Error: 'Query' column is missing in the dataset.")
            return pd.DataFrame(columns=["Query", "Category", "Type", "Response"])
        df["Processed_Query"] = df["Query"].astype(str).apply(preprocess)  # Apply text preprocessing
        return df
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return pd.DataFrame(columns=["Query", "Category", "Type", "Response"])

# Load dataset
query_df = load_query_data("thermax_detailed_dataset.csv")

# Function to extract the best matching query using TF-IDF & Cosine Similarity
def extract_query(user_input, df):
    if df.empty:
        return None

    user_input = preprocess(user_input)  # Preprocess user input

    # Ensure "Processed_Query" column exists
    if "Processed_Query" not in df.columns:
        print("Error: 'Processed_Query' column is missing. Check preprocessing step.")
        return None

    # Vectorize dataset queries and user input using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df["Processed_Query"])
    user_tfidf = vectorizer.transform([user_input])

    # Compute cosine similarity
    cosine_sim = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    best_match_idx = cosine_sim.argmax()

    # Apply a threshold for matching (e.g., 0.5 similarity score)
    if cosine_sim[best_match_idx] > 0.5:
        return df.iloc[best_match_idx]["Query"]

    return None

# Function to get the response
def get_query_response(user_input, df):
    query = extract_query(user_input, df)

    if query:
        response_info = df[df["Query"] == query][["Response", "Type"]].values
        if response_info.size > 0:
            return {"query": query, "response": response_info[0][0], "type": response_info[0][1]}

    return {"response": "Sorry, I couldn't find relevant information."}

# API Endpoint (GET)
@app.route("/ask", methods=["GET"])
def ask_question():
    user_input = request.args.get("question", "").strip()

    if not user_input:
        return jsonify({"error": "Invalid input. Please provide a question."}), 400

    response = get_query_response(user_input, query_df)
    return jsonify(response)


# Run Flask App
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
