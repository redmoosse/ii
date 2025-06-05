# 🧩 Adding New Models

You can easily integrate new transformer-based models using the following steps:

## 1. Add a New Model Directory

Your model must run its own server accessible on port ```5000```, and expose an HTTP POST endpoint at the path ```/process```.
The server should accept a JSON body with the following format:

```json
{ "text": "Your input query here" }
```

Inside the `model/` folder, create a new directory:

```bash
mkdir model/mynewmodel
```
Include the following files inside:

- Dockerfile — to install dependencies and run the model (use ozzey72/biobert-llm-base-cpu:latest) 
with torch, transformers, flask, protobuf, sacremoses dependencies installed

- requirements.txt

- model.py or equivalent script to serve the model.

  This file must have BioModel class with process function.

  For example:
```python
from transformers import Automodel, AutoTokenizer
import torch
from flask import jsonify

MODEL_PATH = ""
class BioModel():
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        self.model = Automodel.from_pretrained(MODEL_PATH)

    #Your custom model logic with json return and query argument
    def process(self, query):
        # Model logic
        return jsonify({
            "direction": "",
            "specialist": ""
        })
```

Or you can use `example` folder in `model/` directory.

## 2. Dockerfile Example
```Dockerfile
# FROM python:3.11-slim
# This docker image based on python:3.11-slim
# With installed packages: torch, transformers, flask, protobuf, sacremoses
FROM ozzey72/biobert-llm-base-cpu:latest

WORKDIR /app
COPY . .
# RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "index.py"]
```

And in the end you need to write name of your folder from `model/` to `.github/workflows/models.yml` file.

For example adding **biollm** model:

```yml
jobs:
  build-and-push-models:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        model:
          - base-cpu
          - biobert
          - biogpt
          - biobert-classificator
          # write here your folder name
          - biollm

```