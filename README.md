# OmindAI – Technical Assignment

## Architecture Overview

We use a **classic 3‑tier pattern** that keeps concerns isolated yet simple enough for local development and a Dockerized hand‑off.

1. **Frontend (React + Vite)** – runs in the user’s browser. Talks only to the API at `/api/*`.
2. **API (Express 18, Node v23)** – stateless REST service exposing upload, list, detail, delete. Holds the lightweight background pipeline in‑process so we don’t introduce extra infra for a take‑home.
3. **Data layer (MongoDB 6)** – single replica container, mounted volume for persistence. All domain objects live here (`calls`, `transcripts`, `analyses`, `coachingplans`, `users`).

Below is a **Mermaid sequence / component diagram** that captures the high‑level flow.

```mermaid
flowchart LR
    subgraph Browser
        A[React UI]\nDashboard / Upload
    end

    subgraph API[Express  ⌥ Node 23]
        B[REST Controller]\n/api/calls/*
        C[Processor Loop]\n(setInterval)
        D[Services]\n(Whisper • GPT-4o)
    end

    subgraph Data
        E[(MongoDB 6)]
    end

    A --HTTP--> B
    B --Mongoose--> E
    C --Mongoose--> E
    C --Audio file--> D
    D --JSON metrics--> E

    classDef dashed stroke-dasharray: 3 3;
    class C dashed;
```

## Why this architecture?

| Concern                    | Choice                                                          | Rationale                                                                               |
| -------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Simplicity vs. realism** | **In‑process background worker** instead of Redis/BullMQ        | Meets assignment goals without extra services; easy to replace with a real queue later. |
| **Portability**            | Everything works on **mac M‑chip** with only Docker for Mongo   | No `docker compose` for the API until optional prod step.                               |
| **Scalability path**       | Stateless API → can lift worker to a separate pod               | Keeps the contract clean; only `/uploads` volume is stateful.                           |
| **Costs**                  | Use **Whisper & GPT** only when needed; chunking reduces tokens | Pay‑as‑you‑go; works with free tier keys.                                               |

## Local development

```bash
# 1. Mongo
docker compose up -d             # runs omind-mongo

# 2. Backend
cd backend && cp .env.example .env   # add your OPENAI_API_KEY
npm install && npm run dev          # http://localhost:5050

# 3. Frontend
cd frontend
npm install && npm run dev          # http://localhost:3000 ↔ proxy /api
```

## Production / full‑docker (optional)

Later we can extend `docker-compose.yml`:

* **backend** service built from `backend/Dockerfile`, depends on `mongo`.
* **frontend** static build served via nginx‑alpine.

```mermaid
dgraph TD
    subgraph Compose
        mongo[(Mongo 6)]
        backend[Node API]
        frontend[Nginx + Static]
    end
    browser --443--> frontend --proxy--> backend --27017--> mongo
```

---

*Last updated: 20 Jul 2025*
