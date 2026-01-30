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

# Database Package

Shared Prisma database package for the mortgage platform monorepo.

## Overview

This package contains the Prisma schema, migrations, and database client for all services. It provides a centralized database layer that can be used by any service in the monorepo.

## Prerequisites

- PostgreSQL database (local or remote)
- `DATABASE_URL` environment variable set

## Installation

From the root directory:

```bash
pnpm install
```

This will install Prisma and generate the Prisma Client.

## Setup

### 1. Configure Database URL

Set the `DATABASE_URL` environment variable in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mortgage_platform?schema=public"
```

### 2. Generate Prisma Client

```bash
pnpm --filter "@mortgage-platform/db" db:generate
```

### 3. Create Initial Migration

This will create the migration files and apply them to your database:

```bash
pnpm --filter "@mortgage-platform/db" db:migrate
```

When prompted, enter a migration name (e.g., `init` or `initial_schema`).

**Note**: This command will:
- Create migration SQL files in `prisma/migrations/`
- Apply the migration to your database
- Regenerate Prisma Client automatically

## Usage

Import the Prisma client in your service:

```typescript
import { prisma } from '@mortgage-platform/db';

// Example: Create a user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash: 'hashed_password',
  },
});
```

## Available Scripts

- `db:generate` - Generate Prisma Client
- `db:migrate` - Create and apply migrations (development)
- `db:migrate:deploy` - Apply migrations (production)
- `db:studio` - Open Prisma Studio (database GUI)
- `db:seed` - Run database seed script

## Database Schema

### Users Table

Stores user account information with tenant support.

**Fields:**
- `id` (UUID, Primary Key)
- `email` (String, Unique, Indexed)
- `phone` (String, Nullable, Unique, Indexed)
- `password_hash` (String) - Hashed password
- `first_name` (String, Nullable)
- `last_name` (String, Nullable)
- `status` (Enum: ACTIVE, INACTIVE, SUSPENDED, DELETED, Default: ACTIVE, Indexed)
- `email_verified` (Boolean, Default: false)
- `phone_verified` (Boolean, Default: false)
- `broker_id` (String, Nullable, Indexed) - For multi-tenant support
- `loan_officer_id` (String, Nullable, Indexed) - For multi-tenant support
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Unique index on `phone`
- Index on `broker_id`
- Index on `loan_officer_id`
- Index on `status`

**Relations:**
- One-to-many with `verification_codes`
- One-to-many with `refresh_tokens`

### Verification Codes Table

Stores email and phone verification codes (OTP) for user verification.

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users, Indexed)
- `type` (Enum: EMAIL, PHONE, Indexed)
- `code_hash` (String) - Hashed verification code
- `expires_at` (DateTime, Indexed)
- `used_at` (DateTime, Nullable, Indexed)
- `attempts` (Integer, Default: 0) - Number of verification attempts
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Index on `type`
- Index on `expires_at`
- Index on `used_at`

**Relations:**
- Many-to-one with `users` (cascade delete)

### Refresh Tokens Table

Stores refresh tokens for user authentication sessions.

**Fields:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users, Indexed)
- `token_hash` (String, Indexed) - Hashed refresh token
- `expires_at` (DateTime, Indexed)
- `revoked_at` (DateTime, Nullable, Indexed) - When token was revoked
- `user_agent` (String, Nullable) - Browser/client user agent
- `ip_address` (String, Nullable) - Client IP address
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Index on `token_hash`
- Index on `expires_at`
- Index on `revoked_at`

**Relations:**
- Many-to-one with `users` (cascade delete)

## Multi-Tenant Support

The schema is designed to support multi-tenant architecture in the future:

- `users.broker_id` - Links user to a mortgage broker (nullable)
- `users.loan_officer_id` - Links user to a loan officer (nullable)

These fields are indexed for efficient querying and can be used to filter users by tenant in future implementations.

## Enums

### UserStatus

- `ACTIVE` - User account is active
- `INACTIVE` - User account is inactive
- `SUSPENDED` - User account is suspended
- `DELETED` - User account is soft-deleted

### VerificationType

- `EMAIL` - Email verification code
- `PHONE` - Phone verification code

## Security Considerations

1. **Password Hashing**: Always hash passwords before storing in `password_hash` field
2. **Code Hashing**: Always hash verification codes before storing in `code_hash` field
3. **Token Hashing**: Always hash refresh tokens before storing in `token_hash` field
4. **Expiration**: Always set appropriate `expires_at` values for verification codes and tokens
5. **Cascade Deletes**: User deletion cascades to related verification codes and refresh tokens

## Migration Workflow

### Development

```bash
# Create a new migration
pnpm --filter "@mortgage-platform/db" db:migrate

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply the migration to your database
# 3. Regenerate Prisma Client
```

### Production

```bash
# Apply migrations without prompts
pnpm --filter "@mortgage-platform/db" db:migrate:deploy
```

## Prisma Studio

View and edit your database through a GUI:

```bash
pnpm --filter "@mortgage-platform/db" db:studio
```

Opens at http://localhost:5555

## Adding to a Service

To use this database package in a service (e.g., auth-service):

1. Add dependency to service's `package.json`:
   ```json
   {
     "dependencies": {
       "@mortgage-platform/db": "workspace:*"
     }
   }
   ```

2. Import and use:
   ```typescript
   import { prisma } from '@mortgage-platform/db';
   ```

3. Ensure `DATABASE_URL` is set in the service's environment

## Notes

- All timestamps use `created_at` and `updated_at` (snake_case) for database consistency
- All foreign keys use `_id` suffix (e.g., `user_id`)
- Cascade deletes ensure data consistency when users are deleted
- Indexes are optimized for common query patterns
