#FROM python:3.11-slim
# This docker image based on python:3.11-slim
# With installed packages: torch, transformers, flask, protobuf, sacremoses
FROM ozzey72/biobert-llm-base-cpu:latest

WORKDIR /app
COPY . .
#RUN pip install -r requirements.txt

# # Preload model from HuggingFace
# RUN python preload.py

EXPOSE 5000

ENV FLASK_APP=bioGPT.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

CMD ["flask", "run"]
