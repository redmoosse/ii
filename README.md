# 🤖 BiOBERT-LLM-Backend

 BioBERT LLM project backend, after authorisation through which you can query the BioBERT language model.

 ## 🚀 Technology Stack 

- Nest.js
- WebSocket
- Passport.js + Google OAuth 2.0
- JWT
- Swagger (Document API)
- Docker
- Flast (For LM)

## 📁 Project Structure

```bash
.
├── benchmark/             # Scripts for testing model performance
├── model/                 # Individual ML models (each with its own Dockerfile)
├── src/                   # Backend API logic (NestJS)
│   ├── auth/              # Google SSO and JWT authentication module
│   ├── model/             # Module for communicating with ML models
│   ├── common/            # Shared files (e.g., global filters)
│   ├── socket/            # WebSocket (Socket.IO) gateway and handlers
│   ├── routes/            # REST API routes
│   └── main.ts            # NestJS application bootstrap
├── test/                  # Jest unit/integration test configuration
├── docker-compose.yml     # Docker orchestration file
├── Dockerfile             # Dockerfile for building the NestJS app
├── .env                   # Environment variables
├── docs/                  # Project documentation


## 📌 TODO

- [ ] ✨ **Middleware** for Socket.IO (verifyJWT)
- [x] 🧱 **Middleware** for REST API (verifyJWT)
- [x] 🧠 Implement `callModelAPI()` in `modelService.js` (call model via HTTP)
- [x] 🐳 Write `Dockerfile` to build and run the project
- [x] 🔐 Add function `verify(token)` for JWT validation
- [x] 📚 Document REST API for Swagger
- [x] ⚙️ Create Github action

## 📄 Documentation Overview

- [🚀 Launch Guide](./docs/launch.md)
- [🧩 Adding New Models](./docs/adding-models.md)
- [📡 API Usage (REST & WebSocket)](./docs/api-usage.md)
- [📊 Benchmarking and Results](./docs/benchmark.md)

