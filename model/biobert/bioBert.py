from transformers import BertForSequenceClassification, AutoTokenizer
from flask import Flask, request, jsonify
import torch

app = Flask(__name__)

model_path = "dmis-lab/biobert-base-cased-v1.1" #TODO: Specify the path to your BioBERT model
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

@app.route("/process", methods=["POST"])
def process():
    data = request.json
    user_input = data.get("text", "")

    inputs = tokenizer(user_input, return_tensors="pt", padding="max_length", truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()

    categories = ["гастроэнтерология", "отоларингология", "хирургия"]
    specialists = ["гастроэнтеролог", "ЛОР", "хирург"]

    # Возвращаем JSON с полем `response`, как ожидает Node.js
    return jsonify({
        "response": f"Рекомендуется консультация {specialists[predicted_class]}.",
        "category": categories[predicted_class],
        "specialist": specialists[predicted_class]
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
