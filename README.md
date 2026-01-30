<!--
@file README.md
@author Balaji Koneti
@linkedin https://www.linkedin.com/in/balaji-koneti/
@github https://github.com/KonetiBalaji/kwalifai

Copyright (C) 2026 Balaji Koneti
All Rights Reserved.

This software is proprietary and confidential.
Unauthorized copying, modification, distribution, or use is prohibited.
-->

# Mortgage Platform Monorepo

A microservices-based mortgage platform with smart calculators, rate alerts, and AI-powered mortgage assistance.

## Architecture

This monorepo is organized into the following structure:

```
mortgage-platform-monorepo/
├── frontend/              # Next.js 14 App Router (TypeScript, Tailwind)
├── services/
│   ├── api-gateway/      # Main API routing service (Node + Express + TypeScript)
│   └── auth-service/     # Authentication service (Node + Express + TypeScript)
├── packages/
│   └── shared/           # Shared types, utilities, and constants
└── infra/                # Docker and deployment documentation
```

### Services Overview

- **Frontend**: Next.js 14 application with App Router, TypeScript, and Tailwind CSS
- **API Gateway**: Main entry point for all API requests, routes to appropriate services
- **Auth Service**: Handles user authentication and authorization
- **Shared Package**: Common TypeScript types, utilities, and constants used across services

## Prerequisites

- Node.js >= 18.0.0
- **pnpm >= 8.0.0** (⚠️ **REQUIRED** - This project uses pnpm workspaces, npm will not work!)
- PostgreSQL (for future database integration)

## Local Development Setup

### 1. Install pnpm

**IMPORTANT**: This project requires `pnpm`, not `npm`. The `workspace:*` protocol is pnpm-specific.

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### 2. Install Dependencies

**⚠️ Always run `pnpm install` from the root directory, not from individual service folders!**

```bash
# From the root directory (E:\Suman_Soumya_Dev)
pnpm install
```

This will install all dependencies for all workspaces (frontend, services, and packages).

### 2. Environment Configuration

Copy the example environment file and configure your local settings:

```bash
cp .env.example .env
```

Edit `.env` with your local configuration:
- Database connection details (PostgreSQL)
- SendGrid API key (for email notifications)
- Service ports
- JWT secrets (for authentication)

### 3. Run Services

#### Development Mode (All Services)

```bash
# Run all services concurrently
pnpm dev
```

This will start:
- Frontend on `http://localhost:3000`
- API Gateway on `http://localhost:3001`
- Auth Service on `http://localhost:3002`

#### Individual Services

```bash
# Frontend only
pnpm --filter "./frontend" dev

# API Gateway only
pnpm --filter "./services/api-gateway" dev

# Auth Service only
pnpm --filter "./services/auth-service" dev
```

### 4. Build for Production

```bash
# Build all packages and services
pnpm build
```

### 5. Type Checking

```bash
# Type check all TypeScript code
pnpm type-check
```

### 6. Linting and Formatting

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

## Workspace Structure

### Frontend (`frontend/`)

Next.js 14 application using the App Router:
- TypeScript for type safety
- Tailwind CSS for styling
- App Router structure in `src/app/`

### API Gateway (`services/api-gateway/`)

Main API routing service:
- Express.js server
- Routes API requests to appropriate services
- Handles CORS, security headers, and request parsing

### Auth Service (`services/auth-service/`)

Authentication and authorization service:
- User authentication
- JWT token management
- Session handling

### Shared Package (`packages/shared/`)

Common code shared across services:
- TypeScript type definitions
- Utility functions
- Constants and configuration

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Package Manager**: pnpm workspaces
- **Database**: PostgreSQL (to be integrated)
- **Email**: SendGrid (to be integrated)

## Development Workflow

1. Make changes in the appropriate service/package
2. Run `pnpm type-check` to ensure TypeScript compiles
3. Run `pnpm lint` to check code quality
4. Test locally using `pnpm dev`
5. Build with `pnpm build` before deployment

## Future Enhancements

- PostgreSQL database integration
- SendGrid email service integration
- Calculator service migration
- Rate alert service implementation
- Multi-tenant support (brokers, loan officers)
- Docker containerization
- CI/CD pipeline setup

## Project Status

This is the initial monorepo structure setup. Feature migration from the monolithic `server.js` will happen in subsequent phases.

## License

Private - All rights reserved
