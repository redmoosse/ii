import torch
from transformers import BioGptTokenizer, BioGptForCausalLM, set_seed
import time
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

MODEL_NAME = "microsoft/BioGPT-Large"
#MODEL_NAME = "microsoft/biogpt"

def remove_tags(text: str):
    text = text.replace(" FREETEXT", "")
    text = text.replace(" <","")
    text = text.replace(" >","")
    text = text.replace(" /","")
    return text

def run_biogpt_inference(prompt: str, min_length:int = 100, max_length:int = 1024, num_beams:int=5,num_return_sequences:int = 1):
    tokenizer = BioGptTokenizer.from_pretrained(MODEL_NAME)

    with torch.no_grad():
        device = "cpu"
        model = BioGptForCausalLM.from_pretrained(MODEL_NAME)  
        model.to(device)

        input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)
        prompt_length = input_ids.shape[1]

        generated_ids = model.generate(input_ids,
            min_length=prompt_length+min_length,
            max_length=prompt_length+max_length,
            num_beams=num_beams,
            num_return_sequences=num_return_sequences,
            do_sample=False,
            early_stopping=True
        )

        generated_texts = []
        for i, generated_id in enumerate(generated_ids):
            text = tokenizer.decode(generated_id, skip_special_tokens=True)
            generated_texts.append(text)

        return generated_texts

VALID_DOCTORS = [
    "Gastroenterology", "Gynecology", "Dermatology", "Pediatric Oncology", "Cardiology",
    "Cardiac Surgery", "Neurology", "Neurosurgery", "Nephrology", "Oncogynecology",
    "Oncology", "Oncosurgery", "Orthopedics", "Otorhinolaryngology", "Ophthalmology",
    "Pediatrics", "Plastic Surgery", "Plastic Surgery in Turkey", "Rheumatology",
    "Vascular Surgery", "Spinal Surgery", "Dentistry and Maxillofacial Surgery",
    "Urology", "Surgery", "Endocrinology"
]

def run(user_prompt: str):
    diagnosis_prompt = f"""{user_prompt} What could be the cause of these symptoms? Possible diagnosis is"""
    diagnosis_output = run_biogpt_inference(
        prompt=diagnosis_prompt,
        min_length=1,
        max_length=8, 
        num_return_sequences=1
    )

    diagnosis = remove_tags(diagnosis_output[0])
    result_diagnosis = diagnosis[len(diagnosis_prompt):-1]

    direction_prompt = f"""{diagnosis} With these symptomes the patient should be referred to a"""
    direction_output = run_biogpt_inference(
        prompt=direction_prompt,
        min_length=1,
        max_length=6,
        num_return_sequences=1,
    )

    direction = remove_tags(direction_output[0])
    result_direction = direction[len(direction_prompt):-1]

    print(f"\nUser prompt:\n{user_prompt}\n")
    print(f"Diagnosis:{result_diagnosis}\n")
    print(f"Direction:{result_direction}\n")

    result = {
        "diagnosis": result_diagnosis,
        "direction": result_direction
    }

    return json.dumps(result)

@app.route("/process", methods=["POST"])
def process():
    data = request.json
    user_input = data.get("text", "")

    return run(user_input)

if __name__ == "__main__":
    print("Starting up...")
    app.run(host="127.0.0.1", port=5000)