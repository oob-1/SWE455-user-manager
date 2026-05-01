# Expense Tracker · User Manager Service

Authentication and user-profile microservice for the Cloud-Based Expense Tracker
(SWE 455). Stateless Node.js + Express, deployed to Cloud Run.

## Endpoints
- `POST /signup`        — create a user (bcrypt-hashed password)
- `POST /login`         — exchange credentials for a JWT (HS256, 1 h)
- `GET  /users/profile` — return the caller's profile
- `GET  /health`        — liveness probe

## Local development

```bash
cp .env.example .env
# Either run Postgres yourself, or use the docker-compose in expense-tracker-infra
npm install
npm run migrate
npm run dev
```

## Build & run with Docker

```bash
docker build -t user-manager .
docker run --rm -p 8080:8080 --env-file .env user-manager
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which uses GitHub
OIDC → GCP Workload Identity Federation to authenticate, builds the image,
pushes it to Artifact Registry, and deploys a new Cloud Run revision.

## Configuration (env vars)

| Variable | Required | Notes |
|---|---|---|
| `PORT`             | no  | default 8080 |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` | yes | PostgreSQL connection |
| `DB_PASSWORD`      | yes | locally from `.env`, in prod from Secret Manager |
| `CLOUD_SQL_INSTANCE_CONNECTION_NAME` | prod-only | enables Cloud SQL connector |
| `JWT_SECRET`       | yes | shared with expense-service |
| `JWT_TTL_SECONDS`  | no  | default 3600 |
| `BCRYPT_COST`      | no  | default 12 |
| `LOG_LEVEL`        | no  | default `info` |
