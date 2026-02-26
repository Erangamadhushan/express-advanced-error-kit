# Express Advanced Error Kit - Demo App

This demo showcases how to use `@erangamadhushan/express-advanced-error-kit`
with:

- ApiError
- asyncHandler
- errorMiddleware
- MongoDB duplicate handling
- Zod validation
- Custom logger
- Docker setup

---

## 🚀 Run with Docker

Make sure Docker is installed.

```bash
docker-compose up --build
```

App runs at:

http://localhost:5000

---

## 🧪 Test Routes

### Manual API Error
GET /error

### Async Error
GET /async-error

### Mongo Duplicate Simulation
GET /mongo-error

### Zod Validation
POST /zod

Body:
```json
{
  "name": 123
}
```

---

## 🧠 Environment Variables

See `.env` file.

---

## 🐳 Services

- Node 18
- MongoDB 7
- TypeScript