# 🧠 BioBERT-LLM Backend

Welcome to the BioBERT-LLM Backend — a modular, extensible backend platform designed to serve transformer-based biomedical NLP models via REST API and WebSocket.

This backend allows you to integrate multiple pretrained models (e.g., BioBERT, BioGPT) as isolated services and interact with them through a unified interface. It's suitable for both development and production use, especially in healthcare, research, and clinical decision support systems.

## 🔍 Key Features

- ⚡ Fast and scalable model serving with Docker containers
- 🔌 REST and WebSocket API interfaces
- 🧱 Modular architecture for plugging in new models easily
- 🔐 Environment-based configuration and secure API keys
- 🐳 Fully containerized using Docker and Docker Compose

## 📦 Project Structure

```bash
.
├── model/                  # Individual models (each with its own Dockerfile)
├── src/                   # Backend API logic (WebSocket + REST)
├── docker-compose.yml     # Main orchestration file
├── .env                   # Environment configuration
├── docs/                  # Documentation
```

## 📄 Documentation Overview

- [🚀 Launch Guide](./docs/launch.md)
- [🧩 Adding New Models](./docs/adding-models.md)
- [📡 API Usage (REST & WebSocket)](./docs/api-usage.md)
