# Library Management System

A full-stack Library Management System, designed for deployment on **AWS Elastic Kubernetes Service (EKS)**.

## Architecture Overview

This monorepo contains the application source code for the Library Management System:

```
lms/
├── api/                  # Backend REST API
├── web/                  # Frontend SPA
├── scripts/              # Build and initialization scripts
└── docker-compose.yml    # Local development orchestration
```

> [!NOTE]
> Infrastructure and Kubernetes deployment manifests are maintained in separate repositories for better separation of concerns and GitOps compatibility. See [Related Repositories](#related-repositories) for details.

---

## Technology Stack

### Backend API

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| TypeScript | Type-safe development |
| Express 5 | Web framework |
| Prisma | ORM and database migrations |
| PostgreSQL | Relational database |
| Zod | Request validation |
| Pino | Structured logging |

### Frontend Application

| Technology | Purpose |
|------------|---------|
| Vue 3 | UI framework |
| Vite | Build tooling |
| Tailwind CSS v4 | Utility-first styling |
| Vue Router | Client-side routing |
| Axios | HTTP client |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Nginx | Web server for static assets |
| PostgreSQL 16 | Database engine |

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- npm or pnpm

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/moabdelazem/lms
cd lms
```

**2. Start the database**

```bash
docker compose up db -d
```

**3. Configure and run the API**

```bash
cd api
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

**4. Configure and run the frontend**

```bash
cd web
npm install
npm run dev
```

### Docker Compose Deployment

Run the complete stack using Docker Compose:

```bash
docker compose up --build
```

This command starts the following services:

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| API | 6767 | Backend REST API |
| Web | 80 | Frontend application |

---

## Container Images

Both services use multi-stage Docker builds optimized for production:

- **API**: Node.js Alpine base with minimal runtime dependencies
- **Web**: Nginx Alpine serving static assets with reverse proxy configuration

### Building Images

```bash
# Build API image
docker build -t lms-api ./api

# Build Web image
docker build -t lms-web ./web --build-arg VITE_API_URL=/api
```

---

## Related Repositories

This repository contains application source code only. Infrastructure and deployment configurations are maintained in separate repositories:

| Repository | Description |
|------------|-------------|
| **lms** | Application source code (API and Web services) |
| **lms-infra** | Terraform modules for AWS infrastructure (EKS, ECR) |
| **lms-k8s** | Kubernetes manifests, Helm charts, and ArgoCD configurations |

### Repository Separation Rationale

- **Separation of Concerns**: Application and infrastructure code have different lifecycles and ownership
- **GitOps Compatibility**: Deployment tools (ArgoCD) can watch dedicated manifest repositories
- **Independent Versioning**: Infrastructure and applications can be versioned and released independently
- **Pipeline Simplicity**: CI/CD pipelines are focused and easier to maintain

---

## Configuration Reference

### API Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | `6767` |
| `NODE_ENV` | Runtime environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `CORS_CREDENTIALS` | Enable CORS credentials | `true` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout | `10000` |

### Web Build Arguments

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:6767/api` |

---
