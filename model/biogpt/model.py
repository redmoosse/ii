from transformers import BioGptForCausalLM, BioGptTokenizer
import torch
import json
from flask import jsonify

MODEL_PATH = "microsoft/BioGPT-Large"

def remove_tags(text: str):
    text = text.replace(" FREETEXT", "")
    text = text.replace(" <","")
    text = text.replace(" >","")
    text = text.replace(" /","")
    text = text.replace("ABSTRACT","")
    text = text.replace("ABSTRACT","")
    return text

VALID_DOCTORS = [
    "Gastroenterology", "Gynecology", "Dermatology", "Pediatric Oncology", "Cardiology",
    "Cardiac Surgery", "Neurology", "Neurosurgery", "Nephrology", "Oncogynecology",
    "Oncology", "Oncosurgery", "Orthopedics", "Otorhinolaryngology", "Ophthalmology",
    "Pediatrics", "Plastic Surgery", "Plastic Surgery in Turkey", "Rheumatology",
    "Vascular Surgery", "Spinal Surgery", "Dentistry and Maxillofacial Surgery",
    "Urology", "Surgery", "Endocrinology"
]

class BioModel():
    def __init__(self):
        self.tokenizer = BioGptTokenizer.from_pretrained(MODEL_PATH)
        self.model = model = BioGptForCausalLM.from_pretrained(MODEL_PATH)
        self.device = "cpu"
        model.to(self.device)

    def run_biogpt_infence(self, prompt: str, min_length:int = 100, max_length:int = 1024, num_beams:int=5,num_return_sequences:int = 1):
        with torch.no_grad():
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            prompt_length = input_ids.shape[1]

            generated_ids = self.model.generate(input_ids,
                min_length=prompt_length+min_length,
                max_length=prompt_length+max_length,
                num_beams=num_beams,
                num_return_sequences=num_return_sequences,
                do_sample=False,
                early_stopping=True
            )

            generated_texts = []
            for i, generated_id in enumerate(generated_ids):
                text = self.tokenizer.decode(generated_id, skip_special_tokens=True)
                generated_texts.append(text)

            return generated_texts


    def process(self, query):
        diagnosis_prompt = f"""{query} What could be the cause of these symptoms? Possible diagnosis is"""
        diagnosis_output = self.run_biogpt_infence(
            prompt=diagnosis_prompt,
            min_length=1,
            max_length=8, 
            num_return_sequences=1
        )

        diagnosis = remove_tags(diagnosis_output[0])
        result_diagnosis = diagnosis[len(diagnosis_prompt):-1]

        direction_prompt = f"""{diagnosis} With these symptomes the patient should be treated with"""
        direction_output = self.run_biogpt_infence(
            prompt=direction_prompt,
            min_length=1,
            max_length=6,
            num_return_sequences=1,
        )

        direction = remove_tags(direction_output[0])
        result_direction = direction[len(direction_prompt):-1]

        print(f"\nUser prompt:\n{query}\n")
        print(f"Diagnosis:{result_diagnosis}\n")
        print(f"Treatment:{result_direction}\n")

        result = {
            "answer": f"Diagnosis: {result_diagnosis} and possible treatment is {result_direction}"
        }

        return json.dumps(result)

    