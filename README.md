# 🤖 BiOBERT-LLM-Backend

 BioBERT LLM project backend, after authorisation through which you can query the BioBERT language model.

 ## 🚀 Technology Stack 

- Node.js
- Express.js
- Socket.IO
- Passport.js + Google OAuth 2.0
- JWT
- Swagger (Document API)
- Docker

## 📦 Project Structure

```bash
.
├── model/                 # Individual models (each with its own Dockerfile)
├── src/                   # Backend API logic (WebSocket + REST)
    ├── auth/              # Google SSO и JWT
    ├── routes/            # REST API routs
    ├── socket/            # Socket.IO handlers
    ├── services/          # Logic, model calls
    ├── middleware/        # Middleware
    ├── utils/             # JWT utils etc.
    └── app.js             #Configuring the Express application
├── docker-compose.yml     # Main orchestration file
├── server.js              # Entry point
├── .env                   # Environment configuration
├── docs/                  # Documentation
```

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

