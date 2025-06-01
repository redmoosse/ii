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

- model.py or equivalent script to serve the model

## 2. Dockerfile Example
```Dockerfile
FROM ozzey72/biobert-llm-base-cpu:latest
# FORM python:3.11-slim if you have distinct server
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "mynewmodel.py"]
```