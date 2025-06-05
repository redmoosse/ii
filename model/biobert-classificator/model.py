from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import json

MODEL_PATH = "OzzeY72/biobert-medical-specialities"

class BioModel():
    def __init__(self):
        self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)   
        self.id2label = self.model.config.id2label

    def process(self, query):
        inputs = self.tokenizer(
            query,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            predicted_class_id = int(torch.argmax(logits, dim=1).item())

        predicted_label = self.id2label[predicted_class_id]
        result = {
            "direction": predicted_label,
            "specialist": predicted_label
        }

        return json.dumps(result)