# 🚀 Launch Guide

Follow these steps to start the BioBERT-LLM backend using Docker Compose.

## 1. Clone the Repository

```bash
git clone https://github.com/OzzeY72/BiOBERT-LLM-Backend.git
cd BiOBERT-LLM-Backend
```

## 2. Clone .env File
```bash
cp .env.scheme .env
```
Edit the .env file and provide:
- CLIENT_ID and CLIENT_SECRET (from Google OAuth2)
- DOCKER_MODEL (one of the [available models](#available-models) you'd like to use)

## 3. 🐳 Run with Docker Compose
```bash
docker compose up --build
```
This will launch:

- backend on port 3000

- model containers (e.g., biogpt, biobert) available internally at http://model:5000

Ensure that the environment variable DOCKER_MODEL is set before running if required.

## 4. 🚀 Run with script (TODO)
```bash 
git clone https://github.com/OzzeY72/BiOBERT-LLM-Backend.git 
cd BiOBERT-LLM-Backend 
cp .env.scheme .env # 🔑 Add CLIENT_ID and CLIENT_SECRET from Google API Console before launch 
npm install npm run dev 
```
This will launch backend on port 3000

Ensure that the environment variable MODEL_HOST is set to host with port number of your launched model.

Example 
```bash
MODEL_HOST=localhost:5000
```

## Available Models
The following model directories are currently available under the model/ folder:

biobert – BioBERT transformer fine-tuned to classification biomedical text

biogpt – BioGPT language model for medical text generation

To select a model, set DOCKER_MODEL in your .env like:
```bash
DOCKER_MODEL=biobert
```