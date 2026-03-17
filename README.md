# Project Management Tool Monorepo

A production-ready full-stack project management system using NestJS, MongoDB, JWT auth, and React with Redux Toolkit.

## Overview

This repository contains:

- `backend`: NestJS API with Mongoose models and JWT authentication
- `frontend`: React + TypeScript SPA with Redux Toolkit, React Router, Axios, TailwindCSS
- `packages/types`: shared domain type definitions

## Tech Stack

### Backend
- NestJS
- MongoDB + Mongoose
- JWT Authentication (`@nestjs/jwt`, Passport)
- Password hashing with `bcrypt`

### Frontend
- React + TypeScript (Vite)
- Redux Toolkit
- React Router
- Axios
- TailwindCSS
- React Hook Form + Yup validation

## Folder Structure

```text
project-management-tool/
  backend/
    src/
    seed/
    test/
  frontend/
    src/
  packages/
    types/
  README.md
```

## Setup

### Prerequisites

- Node.js 20+
- MongoDB running locally or remote Mongo URI
- pnpm (recommended)

### Install dependencies (workspace)

```bash
pnpm install
```

### Environment variables

Use a single root env file as the starting point.

1) Copy `.env.example` to `.env` at repository root.
2) Update values as needed.

Root `.env` example:

```env
MONGODB_URI=mongodb://localhost:27017/project_management_app
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
```

Optional overrides:
- `backend/.env` (backend-only override)
- `frontend/.env.local` (frontend-only override)

## Run Backend

```bash
pnpm dev:backend
```

## Run Frontend

```bash
pnpm dev:frontend
```

## Seed Script

```bash
pnpm seed
```

## Test Credentials

- email: test@example.com
- password: Test@123

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Projects (JWT protected)

- `POST /projects`
- `GET /projects?page=1&limit=10&search=keyword`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### Tasks (JWT protected)

- `POST /tasks`
- `GET /tasks/project/:projectId`
- `GET /tasks/project/:projectId?status=todo`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Features

- Register/Login with JWT
- Route protection with JWT guard (backend) and protected routes (frontend)
- Project CRUD with ownership checks
- Project pagination and title search
- Task CRUD scoped to project ownership
- Task filtering by status
- Shared domain types package
- Seed script with demo user, projects, and tasks
- Basic Jest unit tests
- Dockerfiles for backend and frontend

## Docker

Build and run each app independently.

Backend:

```bash
cd backend
docker build -t pm-backend .
docker run -p 3000:3000 --env-file .env pm-backend
```

Frontend:

```bash
cd frontend
docker build -t pm-frontend .
docker run -p 8080:80 pm-frontend
```
