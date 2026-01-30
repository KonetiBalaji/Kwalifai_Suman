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

# Statement Analysis Service

Microservice responsible for mortgage statement upload, storage, and analysis.

## Overview

This service handles:
- **Statement Upload**: Accepts PDF/image uploads via multipart form data
- **Statement Persistence**: Stores statement metadata and files in PostgreSQL
- **Analysis Engine**: Runs mathematical analysis on statement data (V1)
- **Future-Ready**: Designed for OCR (V2) and AI enrichment (V3) without breaking changes

## Architecture

```
Client Request
    ↓
API Gateway (:3001)
    ↓
POST /api/upload-statement
GET /api/statement/:id
    ↓
Statement Analysis Service (:3005)
    ↓
    ├─→ File Storage (Local/S3/GCS)
    ├─→ Prisma ORM → PostgreSQL
    └─→ Analysis Engine V1
```

## API Endpoints

### POST /api/upload-statement

Upload and analyze a mortgage statement.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Field name: `mortgageStatement` (file)
- Form fields:
  - `currentBalance` (optional)
  - `currentRate` (optional)
  - `monthlyPayment` (optional)
  - `propertyAddress` (optional)
  - `lenderName` (optional)
  - `escrowBalance` (optional)
  - `loanNumber` (optional)
  - `nextPaymentDate` (optional)
  - `sessionId` (optional)
  - `customerName` (optional)
  - `customerEmail` (optional)
  - `customerPhone` (optional)

**Response:**
```json
{
  "success": true,
  "statementId": "uuid",
  "message": "Statement analyzed successfully",
  "analysis": {
    "currentLoanBalance": 350000,
    "currentInterestRate": 7.25,
    "currentMonthlyPayment": 2400,
    "remainingTermMonths": 208,
    "propertyAddress": "Property address not provided",
    "lenderName": "Current lender not specified",
    "loanNumber": "Not specified",
    "nextPaymentDate": "Not specified",
    "escrowBalance": 2500,
    "marketComparison": {
      "currentMarketRate": 6.44,
      "potentialNewPayment": 2195,
      "potentialMonthlySavings": 205
    },
    "recommendations": {
      "refinanceOpportunity": true,
      "potentialSavings": 205,
      "recommendedAction": "Strong refinancing opportunity - contact a specialist!"
    }
  },
  "file": {
    "filename": "mortgage-statement-1234567890-987654321.pdf",
    "originalName": "statement.pdf",
    "size": 245678
  }
}
```

### GET /api/statement/:id

Retrieve a statement analysis by ID.

**Response:**
```json
{
  "id": "uuid",
  "uploadedAt": "2026-01-20T12:00:00.000Z",
  "sessionId": "session-123",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "status": "analyzed",
  "analyzed": true,
  "formData": { ... },
  "analysis": { ... },
  "filename": "mortgage-statement-1234567890-987654321.pdf",
  "originalName": "statement.pdf",
  "path": "/uploads/mortgage-statement-1234567890-987654321.pdf",
  "size": 245678,
  "mimetype": "application/pdf"
}
```

## Service Structure

```
statement-analysis-service/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── index.ts                  # Service entry point
│   ├── controllers/
│   │   └── statementController.ts # Request handlers
│   ├── services/
│   │   ├── analysisEngine.ts     # Analysis logic (V1)
│   │   ├── fileStorage.ts        # File storage abstraction
│   │   └── statementService.ts   # Database operations
│   ├── routes/
│   │   └── statement.ts          # Route definitions
│   └── middleware/
│       └── rateLimiter.ts        # Rate limiting
```

## Analysis Engine

### V1 (Current)

- **Input**: Manual form data
- **Logic**: Mathematical calculations
- **Output**: Refinance recommendations based on market rates

### Future Versions

- **V2_OCR**: Extract data from PDF/image using OCR
- **V3_AI**: AI-powered insights and recommendations

All versions maintain the same response format for backward compatibility.

## File Storage

### Current: Local Filesystem

- Files stored in `uploads/` directory
- Naming: `mortgage-statement-{timestamp}-{random}.{ext}`
- Max size: 10MB
- Supported formats: PDF, JPEG, JPG, PNG

### Future: Cloud Storage

The `FileStorageProvider` interface allows swapping to:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

No code changes required in controllers/services.

## Database Models

### Statement

Main statement record with metadata.

### StatementFile

File metadata and storage information.

### StatementAnalysis

Analysis results (versioned, supports multiple runs).

## Environment Variables

```env
# Service
STATEMENT_ANALYSIS_SERVICE_PORT=3005
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mortgage_db

# File Storage
FILE_STORAGE_TYPE=local
UPLOADS_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Development

```bash
# Install dependencies (from root)
pnpm install

# Run service
pnpm --filter ./services/statement-analysis-service dev

# Build
pnpm --filter ./services/statement-analysis-service build
```

## Testing

```bash
# Upload statement
curl -X POST http://localhost:3001/api/upload-statement \
  -F "mortgageStatement=@statement.pdf" \
  -F "currentBalance=350000" \
  -F "currentRate=7.25" \
  -F "monthlyPayment=2400"

# Get statement
curl http://localhost:3001/api/statement/{statementId}
```

## Migration from Legacy

The service maintains 100% API compatibility with the legacy `server.js` implementation:

- ✅ Same endpoint paths
- ✅ Same request/response formats
- ✅ Same field names
- ✅ Same analysis logic
- ✅ Same defaults

No client changes required.
