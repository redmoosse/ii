## 🧱 Project Architecture

This project is built using **NestJS**, a progressive Node.js framework for building efficient and scalable server-side applications. It follows a **modular monolith** architecture where functionality is organized into self-contained modules.

### 🔧 Core Principles

- **Modular Structure**: Each domain-specific feature (e.g., authentication, model communication) is encapsulated within its own module. A module typically contains:
  - Controller: Defines routes.
  - Service: Implements business logic.
  - Gateway (if applicable): Handles WebSocket communication.
  - Module: Declares and wires the components together.

- **Dependency Injection**: Services and other providers are injected via NestJS’s powerful DI system, ensuring loose coupling and easier testing.

- **Centralized Configuration**: `@nestjs/config` is used to manage environment variables via a `.env` file.

---

### 📦 Module Overview

#### `auth/`
- Handles Google OAuth2 login and JWT-based authentication.
- Uses `AuthGuard` (based on `@nestjs/passport`) to protect routes and WebSocket connections.
- Contains:
  - `AuthService`: Issues and verifies JWTs.
  - `JwtStrategy`: Defines JWT validation logic.
  - `GoogleStrategy`: Defines Google token validation logic.
  - `JwtAuthGuard`: Guard to secure routes.
  - `AuthController`: Endpoint for Google login (TODO: Password login).

#### `model/`
- Sends data to and receives predictions from machine learning models via HTTP or WebSocket.
- Contains:
  - `ModelService`: Core logic for sending requests to ML models.
  - `ModelGateway`: WebSocket gateway to handle real-time inference requests.
  - `ModelController`: REST API to handle real-time inference requests.

#### `common/`
- Contains reusable utilities like:
  - Interfaces, filters, constants, and helpers.

---

### 🧪 Testing

- Tests are written using **Jest**.
- Defined inside each module with `.spec.ts` ending.
- Supports unit testing for services, controllers, and gateways.

---

### 🚀 Execution Flow

1. User authenticates via Google → receives JWT.
2. JWT is attached to protected requests (REST or WebSocket).
3. `JwtAuthGuard` validates JWT and attaches user info.
4. Authenticated user sends a request (REST or WebSocket).
5. The request is processed by the respective service (e.g., `ModelService`).
6. Result is returned to the client or pushed via WebSocket.

---

### 🧰 Technologies Used

- **NestJS** – Backend framework
- **Socket.IO** – WebSocket support
- **Passport + JWT** – Authentication
- **Jest** – Testing
- **Docker + Docker Compose** – Containerization
- **.env** – Configuration

This architecture provides a clean separation of concerns, strong typing (via TypeScript), and easy extensibility for new features like logging, rate limiting, additional models, etc.
