from transformers import BertForSequenceClassification, AutoTokenizer
import torch
import json

MODEL_PATH = "Vitalii2005/fine-tuned-biobert"

class BioModel():
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        self.model = BertForSequenceClassification.from_pretrained(MODEL_PATH)

    def process(self, query):
        inputs = self.tokenizer(query, return_tensors="pt", padding="max_length", truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)

        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

        categories = ["гастроэнтерология", "отоларингология", "хирургия"]
        specialists = ["гастроэнтеролог", "ЛОР", "хирург"]

        result = {
            "response": f"Рекомендуется консультация {specialists[predicted_class]}.",
            "category": categories[predicted_class],
            "specialist": specialists[predicted_class]
        }

        # Возвращаем JSON с полем `response`, как ожидает Node.js
        return json.dumps(result)

    
