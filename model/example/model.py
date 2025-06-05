from transformers import BertForSequenceClassification, AutoTokenizer
import torch
from flask import jsonify

MODEL_PATH = ""

class BioModel():
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        self.model = BertForSequenceClassification.from_pretrained(MODEL_PATH)

    #Your custom model logic with return in json and query argument
    def process(self, query):
        inputs = self.tokenizer(query, return_tensors="pt", padding="max_length", truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)

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