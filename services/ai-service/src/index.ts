/**
 * @file index.ts
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

import dotenv from 'dotenv';
import { app } from './app';
import { initializeTaskProcessor } from './services/scheduler/taskScheduler';
import path from 'path';

// Load environment variables from ai-service/.env
// Try multiple paths to handle different execution contexts (monorepo root vs service directory)
const envPaths = [
  path.resolve(__dirname, '../.env'), // When running from service directory
  path.resolve(process.cwd(), 'services/ai-service/.env'), // When running from monorepo root (pnpm dev)
  path.resolve(process.cwd(), '.env'), // Fallback to root .env
];

for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error && process.env.OPENAI_API_KEY) {
    console.log(`[AI] Loaded .env from: ${envPath}`);
    break;
  }
}

const PORT = process.env.AI_SERVICE_PORT || 3006;

// Initialize task processor
initializeTaskProcessor();

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI] LOWI AI Service running on port ${PORT}`);
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  console.log(`[AI] OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  console.log(`[AI] OpenAI API Key: ${hasOpenAIKey ? 'Set' : 'Not set (using fallback mode)'}`);
  console.log(`[AI] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
