# 🔌 API Usage

Before interacting with the API, you must authenticate using OAuth2 or username/password.

---

## 🔐 Authentication

### 1. OAuth2 (Google)

1. Go to your `.env` file.
2. Provide `CLIENT_ID` and `CLIENT_SECRET` from Google OAuth2 Console.
3. Authenticate via browser — you'll receive a token to use in requests.

```http
POST /auth/google
Content-Type: application/json

{
  "code": "code from google"
}
```
```json
{
  "access_token": "your-jwt-token",
  "token_type": "bearer"
}
```

### 2. Username & Password Login (TODO)

You can also authenticate by sending a POST request to `/auth/login`:

```http
POST /auth/login
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-password"
}
```

Successful response:

```json
{
  "access_token": "your-jwt-token",
  "token_type": "bearer"
}
```

---

## 📡 REST API

### 🔍 POST /model/question

Send a medical query using REST API:

```http
POST /model/question
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "text": "complaints"
}
```

Successful response:

```json
{
  "success": "true",
  "diagnosis": "Diagnosis",
  "direction": "Direction"
}
```

---

## 🔌 WebSocket API

Connect to WebSocket server `ws://localhost:3000`.

### Event: `question`

```json
{
  "event": "question",
  "message": "complaints"
}
```

### Response:

```json
{
  "event": "result",
  "data": {
    "success": "true",
    "diagnosis": "Diagnosis",
    "direction": "Direction"
  }
}
```

---

## ✅ Notes

- You must **authorize first** before accessing the REST or WebSocket endpoints.
- Models are served dynamically based on the `DOCKER_MODEL` setting therefore response may be different.
