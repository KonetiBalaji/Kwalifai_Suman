/**
 * @file chat.ts
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

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { processChatMessage } from '../services/openai/chatService';
import { validateResponse } from '../services/guardrails/responseValidator';
import { filterContent } from '../services/guardrails/contentFilter';
import { logAuditEntry } from '../services/guardrails/auditLogger';
import { generateLegacyResponse } from '../services/fallback/legacyResponse';
import { CorrelationRequest } from '../middleware/correlationId';
import { AuthenticatedRequest } from '../middleware/auth';
import { ChatResponse } from '../types/ai';

const router = Router();

// In-memory session storage (in production, use Redis or database)
const sessions: Record<string, {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: string;
}> = {};

/**
 * GET /chat
 * Health check / status endpoint (prevents 404 from browser prefetch)
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'lowi-ai',
    mode: process.env.OPENAI_API_KEY ? 'ai' : 'fallback',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /chat
 * Main chat endpoint for LOWI AI
 */
router.post('/', async (req: CorrelationRequest & AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  console.log(`[CHAT] ===== RECEIVED REQUEST =====`);
  console.log(`[CHAT] Method: ${req.method}`);
  console.log(`[CHAT] Path: ${req.path}`);
  console.log(`[CHAT] Original URL: ${req.originalUrl}`);
  console.log(`[CHAT] Body:`, JSON.stringify(req.body, null, 2));
  console.log(`[CHAT] Headers:`, JSON.stringify(req.headers, null, 2));
  
  const { message } = req.body;
  const correlationId = req.correlationId || uuidv4();
  const sessionId = req.body.sessionId || `session_${Date.now()}_${uuidv4()}`;
  const authToken = req.headers.authorization?.replace('Bearer ', '');

  // Validate request
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    console.log('[CHAT] Validation failed: message is empty');
    return res.status(400).json({
      error: 'Message required',
      message: 'Please provide a message to chat with LOWI.',
      correlationId,
    });
  }

  // Initialize or get session
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      sessionId,
      messages: [],
      createdAt: new Date().toISOString(),
    };
  }

  const session = sessions[sessionId];

  try {
    console.log(`[CHAT] Processing message: "${message.substring(0, 50)}..." | Session: ${sessionId} | User: ${req.userId || 'anonymous'}`);
    
    // Process chat message
    const aiResponse = await processChatMessage(message, {
      user: req.user,
      sessionId,
      correlationId,
      authToken,
      conversationHistory: session.messages,
    });

    console.log(`[CHAT] Response generated | Intent: ${aiResponse.userIntent} | Length: ${aiResponse.replyMarkdown.length}`);

    // Validate response
    const validatedResponse = validateResponse(aiResponse);

    // Filter content (additional safety)
    validatedResponse.replyMarkdown = filterContent(validatedResponse.replyMarkdown);

    // Update session history
    session.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: validatedResponse.replyMarkdown }
    );

    // Keep only last 20 messages
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    // Build response
    const response: ChatResponse = {
      ...validatedResponse,
      sessionId,
      correlationId,
    };

    // Audit log
    const processingTime = Date.now() - startTime;
    logAuditEntry({
      timestamp: new Date().toISOString(),
      userId: req.userId,
      sessionId,
      correlationId,
      userMessage: message,
      aiResponse: validatedResponse,
      processingTimeMs: processingTime,
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    });

    res.json(response);
  } catch (error: any) {
    console.error('[CHAT] Error processing message:', error);
    console.error('[CHAT] Error stack:', error.stack);
    
    const processingTime = Date.now() - startTime;
    
    // Try to return a fallback response instead of error
    try {
      const fallbackResponse = await generateLegacyResponse(message, correlationId);
      
      // Audit log error
      logAuditEntry({
        timestamp: new Date().toISOString(),
        userId: req.userId,
        sessionId,
        correlationId,
        userMessage: message,
        aiResponse: fallbackResponse,
        processingTimeMs: processingTime,
      });

      const response: ChatResponse = {
        ...fallbackResponse,
        sessionId,
        correlationId,
      };

      return res.json(response);
    } catch (fallbackError) {
      console.error('[CHAT] Fallback also failed:', fallbackError);
      
      // Ultimate fallback
      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while processing your message. Please try again.',
        correlationId,
      });
    }
  }
});

export default router;
