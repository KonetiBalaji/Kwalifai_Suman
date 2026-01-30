/**
 * @file README.md
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 *
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

# Rate Alert Service

Microservice for managing mortgage rate alerts. Allows users to set target interest rates and receive notifications when rates drop to their specified threshold.

## Overview

This service handles:
- Creating rate alerts
- Retrieving user's rate alerts
- Updating rate alerts
- Deleting/deactivating rate alerts
- Rate monitoring and notification triggering (to be implemented)

## Base Path

All endpoints are prefixed with `/rate-alerts`

## Endpoints

### Health Checks
- `GET /health` - Basic health check
- `GET /ready` - Readiness check (includes database connectivity)

### Rate Alerts
- `POST /rate-alerts` - Create a new rate alert
- `GET /rate-alerts` - Get rate alerts (with optional filters)
- `GET /rate-alerts/:id` - Get a specific rate alert by ID
- `PUT /rate-alerts/:id` - Update a rate alert
- `DELETE /rate-alerts/:id` - Delete/deactivate a rate alert

## Features

- **Idempotency**: Supports `Idempotency-Key` header for safe retries
- **Rate Limiting**: Different limits for create vs. read operations
- **Tenant Context**: Extracts tenant information from headers
- **Correlation ID**: Passes through correlation IDs for request tracing
- **Validation**: Zod schema validation for all inputs
- **Error Handling**: Standardized error response format

## Environment Variables

```env
RATE_ALERT_SERVICE_PORT=3004
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/mortgage_platform
NODE_ENV=development
```

## Running the Service

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

## Status

⚠️ **Currently in skeleton phase** - All endpoints return `501 Not Implemented`. Business logic to be implemented.
