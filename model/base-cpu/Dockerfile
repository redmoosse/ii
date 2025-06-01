FROM python:3.11-slim

RUN apt-get update && apt-get install -y build-essential git && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip
RUN pip install torch
RUN pip install transformers
RUN pip install flask
RUN pip install protobuf
RUN pip install sacremoses
