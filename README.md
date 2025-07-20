# OmindAI – Technical Assignment

## 1 . Architecture Overview

The application follows a **three‑tier arrangement**: presentation (React), service (Express), and data (MongoDB).  A lightweight background pipeline runs inside the service tier to transcribe and analyse audio uploads.


## 2 . Technology Selection

| Layer        | Technology                       | Reason                                                                      |
| ------------ | -------------------------------- | --------------------------------------------------------------------------- |
| Presentation | **React + Vite**                 | Rapid SPA development; hot‑reload; ES‑build‑driven bundle.                  |
| Styling      | **Tailwind CSS**                 | Utility‑first styling with minimal config.                                  |
| Service      | **Node v23 (ESM) + Express v18** | Simple routing; familiar middleware ecosystem.                              |
| Uploads      | **Multer**                       | Stream‑oriented multipart handling; disk storage for audio.                 |
| Background   | In‑process async functions       | Removes external queue; acceptable for assignment scale.                    |
| AI           | **OpenAI SDK v4**                | Direct access to `whisper-1` for transcription and GPT models for analysis. |
| Data         | **MongoDB 6 (Docker)**           | Flexible schema via Mongoose; single container for ease of spin‑up.         |
| Container    | **Docker Compose v3.8**          | Reproducible local stack; optional backend image.                           |

---

## 3 . Local Development

```bash
# 1. start MongoDB
docker compose up -d          # uses the provided mongo‑only compose file

# 2. backend
cd backend
# add OPENAI_API_KEY and PORT=5050 to the .env file

npm install
npm run dev                   # nodemon, auto restarts

# 3. frontend
cd ../frontend
npm install
npm run dev                   # vite on :3000 (proxy → 5050)
```

---

## 4 . API Surface (summary)

| Method   | Path                | Purpose                                    |
| -------- | ------------------- | ------------------------------------------ |
| `GET`    | `/health`           | Liveness probe                             |
| `POST`   | `/api/calls/upload` | Audio upload (multipart)                   |
| `GET`    | `/api/calls`        | Paginated list                             |
| `GET`    | `/api/calls/:id`    | Full result with transcript, metrics, plan |
| `DELETE` | `/api/calls/:id`    | Remove call and linked documents           |

---

## 5 . Future Improvements

* Replace local disk storage with S3‑compatible bucket.
* Extract worker into a separate process backed by BullMQ + Redis. [Added for enhancement]
* Integrate proper authentication (JWT or Auth0).
* Add unit and integration tests (Jest, SuperTest, Cypress).
* CI pipeline for lint → test → build → Docker image publishing.
