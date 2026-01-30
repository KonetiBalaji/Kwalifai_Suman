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

# Calculator Service

Mortgage calculation service providing loan payment calculations, affordability analysis, and scenario saving.

## Endpoints

### POST /calculator/mortgage
Calculate monthly mortgage payment and loan details.

**Request:**
```json
{
  "loanAmount": 500000,
  "interestRate": 6.5,
  "loanTerm": 30,
  "downPayment": 100000,
  "propertyTax": 6000,
  "homeInsurance": 1200,
  "pmi": 0,
  "hoa": 0
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "monthlyPayment": 3164.84,
    "principalAndInterest": 2527.51,
    "totalMonthlyPayment": 3164.84,
    "totalInterest": 409903.60,
    "totalCost": 909903.60,
    "amortizationSchedule": [...]
  }
}
```

### POST /calculator/affordability
Calculate maximum affordable loan amount based on income.

**Request:**
```json
{
  "monthlyIncome": 10000,
  "monthlyDebts": 500,
  "interestRate": 6.5,
  "loanTerm": 30,
  "downPaymentPercent": 20
}
```

### POST /calculator/scenarios
Save a calculator scenario (requires authentication).

### GET /calculator/scenarios
Get user's saved scenarios (requires authentication).

### GET /calculator/scenarios/:id
Get specific scenario by ID (requires authentication).

### DELETE /calculator/scenarios/:id
Delete a scenario (requires authentication).

## Features

- **Mortgage Calculator**: Calculate monthly payments, total interest, and amortization
- **Affordability Calculator**: Determine max loan amount based on income
- **Scenario Saving**: Save and retrieve calculation scenarios
- **Rate Limiting**: 50 requests per 15 minutes per IP

## Database Schema

### CalculatorScenario Model
- Stores user's calculator inputs and results
- Supports multiple calculator types (MORTGAGE, REFINANCE, AFFORDABILITY, AMORTIZATION)
- JSON storage for flexible input/output structures

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set environment variables:
```env
CALCULATOR_SERVICE_PORT=3003
DATABASE_URL=postgresql://...
```

3. Start service:
```bash
pnpm dev
```

## Gateway Integration

Accessible via API Gateway at:
- `POST /api/v1/calculator/mortgage`
- `POST /api/v1/calculator/affordability`
- `POST /api/v1/calculator/scenarios`
- `GET /api/v1/calculator/scenarios`
- `GET /api/v1/calculator/scenarios/:id`
- `DELETE /api/v1/calculator/scenarios/:id`
