/**
 * @file chatService.ts
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

import { openai, OPENAI_MODEL, OPENAI_MAX_TOKENS, OPENAI_TEMPERATURE } from './openaiClient';
import { generateSystemPrompt } from './systemPrompt';
import { mortgageTools } from './toolDefinitions';
import { redactPII } from '../../middleware/redaction';
import { getRates } from '../tools/getRates';
import { runCalculator, CalculatorType } from '../tools/runCalculator';
import { createRateAlert } from '../tools/createRateAlert';
import { getUserProfile } from '../tools/getUserProfile';
import { listUserAlerts } from '../tools/listUserAlerts';
import { saveCalculation } from '../tools/saveCalculation';
import { analyzeStatement } from '../tools/analyzeStatement';
import { User, AiResponse, UserIntent } from '../../types/ai';
import { classifyIntent } from '../guardrails/intentClassifier';
import { validateResponse } from '../guardrails/responseValidator';
import { generateLegacyResponse } from '../fallback/legacyResponse';
import axios from 'axios';

const LEGACY_SERVER_URL = process.env.LEGACY_SERVER_URL || 'http://localhost:3000';

interface ChatContext {
  user?: User;
  sessionId: string;
  correlationId?: string;
  authToken?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

/**
 * Main chat service that orchestrates OpenAI calls and tool execution
 */
export async function processChatMessage(
  message: string,
  context: ChatContext
): Promise<AiResponse> {
  const { user, sessionId, correlationId, authToken, conversationHistory = [] } = context;

  // Redact PII before sending to OpenAI
  const redactedMessage = redactPII(message);

  // Pre-classify intent (guardrail layer 1)
  const preIntent = classifyIntent(redactedMessage);
  if (preIntent === 'non_mortgage') {
    return {
      userIntent: 'unknown',
      replyMarkdown: `I'm LOWI, your mortgage specialist assistant. I can only help with mortgage and home loan questions. 

Could you please ask me about:
- Current mortgage rates
- Mortgage calculators (payment, scenarios, DTOI, refinance, etc.)
- Rate alerts
- Statement analysis
- Mortgage education

How can I help you with your mortgage needs?`,
      explainability: {
        assumptions: [],
        disclaimers: ['I only respond to mortgage-related questions'],
      },
    };
  }

  // Check if OpenAI is available
  if (!openai) {
    console.log('OpenAI client not initialized, using keyword-based fallback');
    return await generateLegacyResponse(message, correlationId);
  }

  try {
    // Build conversation history
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      {
        role: 'system',
        content: generateSystemPrompt(user),
      },
      ...conversationHistory.slice(-10), // Last 10 messages for context
      {
        role: 'user',
        content: redactedMessage,
      },
    ];

    // Call OpenAI with tool definitions
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages as any,
      tools: mortgageTools,
      tool_choice: 'auto', // Let the model decide when to use tools
      max_tokens: OPENAI_MAX_TOKENS,
      temperature: OPENAI_TEMPERATURE,
    });

    const assistantMessage = completion.choices[0]?.message;
    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    // Handle tool calls
    const actionsTaken: AiResponse['actionsTaken'] = [];
    let toolResults: any[] = [];

    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Execute all tool calls
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}');

        try {
          let result: any;

          switch (toolName) {
            case 'getRates':
              result = await getRates(correlationId);
              break;

            case 'runCalculator':
              result = await runCalculator(
                toolArgs.calculatorType as CalculatorType,
                toolArgs.params,
                correlationId
              );
              break;

            case 'createRateAlert':
              result = await createRateAlert(
                {
                  email: toolArgs.email || user?.email || '',
                  loanType: toolArgs.loanType,
                  targetRate: toolArgs.targetRate,
                  loanAmount: toolArgs.loanAmount,
                  propertyAddress: toolArgs.propertyAddress,
                  timeframe: toolArgs.timeframe,
                },
                correlationId
              );
              if (result.success) {
                actionsTaken.push({
                  type: 'create_rate_alert',
                  status: 'success',
                  referenceId: result.alertId,
                });
              } else {
                actionsTaken.push({
                  type: 'create_rate_alert',
                  status: 'failed',
                  error: result.error,
                });
              }
              break;

            case 'getUserProfile':
              if (authToken && user?.id) {
                result = await getUserProfile(user.id, authToken, correlationId);
              } else {
                result = { error: 'User not authenticated' };
              }
              break;

            case 'listUserAlerts':
              result = await listUserAlerts(
                toolArgs.email || user?.email || '',
                correlationId
              );
              break;

            case 'saveCalculation':
              if (authToken) {
                result = await saveCalculation(
                  {
                    calculationType: toolArgs.calculationType,
                    calculationData: toolArgs.calculationData,
                    title: toolArgs.title,
                  },
                  authToken,
                  correlationId
                );
                if (result.success) {
                  actionsTaken.push({
                    type: 'save_calculation',
                    status: 'success',
                    referenceId: result.calculationId,
                  });
                } else {
                  actionsTaken.push({
                    type: 'save_calculation',
                    status: 'failed',
                    error: result.error,
                  });
                }
              } else {
                result = { error: 'User must be authenticated to save calculations' };
              }
              break;

            default:
              result = { error: `Unknown tool: ${toolName}` };
          }

          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            name: toolName,
            content: JSON.stringify(result),
          });
        } catch (error: any) {
          console.error(`Tool execution error for ${toolName}:`, error);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            name: toolName,
            content: JSON.stringify({ error: error.message || 'Tool execution failed' }),
          });
        }
      }

      // Get final response from OpenAI with tool results
      const finalMessages = [
        ...messages,
        assistantMessage,
        ...toolResults,
      ];

      const finalCompletion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: finalMessages as any,
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: OPENAI_TEMPERATURE,
      });

      const finalMessage = finalCompletion.choices[0]?.message?.content || '';
      
      // Extract intent from response
      const intent = extractIntentFromResponse(finalMessage, preIntent);

      // Build explainability
      const explainability = buildExplainability(toolResults, actionsTaken);

      // Add greeting if user is authenticated
      const greeting = user?.firstName ? `Hi ${user.firstName}! ` : undefined;

      return {
        greeting,
        userIntent: intent,
        replyMarkdown: finalMessage,
        explainability,
        actionsTaken: actionsTaken.length > 0 ? actionsTaken : undefined,
      };
    } else {
      // No tool calls - direct response
      const reply = assistantMessage.content || '';
      const intent = extractIntentFromResponse(reply, preIntent);

      return {
        greeting: user?.firstName ? `Hi ${user.firstName}! ` : undefined,
        userIntent: intent,
        replyMarkdown: reply,
        explainability: {
          assumptions: [],
          disclaimers: ['This is an estimate. Final rates depend on credit, LTV, points, and occupancy.'],
        },
      };
    }
  } catch (error: any) {
    console.error('OpenAI error:', error);
    
    // Fallback to keyword-based response (no external dependency)
    console.log('Falling back to keyword-based response');
    return await generateLegacyResponse(message, correlationId);
  }
}

/**
 * Fallback to legacy keyword-based response
 */
async function fallbackToLegacy(
  message: string,
  sessionId: string,
  correlationId?: string
): Promise<AiResponse> {
  try {
    const response = await axios.post(
      `${LEGACY_SERVER_URL}/api/chat/message`,
      {
        sessionId,
        message,
      },
      {
        headers: {
          'x-correlation-id': correlationId,
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.reply) {
      return {
        userIntent: 'general_mortgage',
        replyMarkdown: response.data.reply,
        explainability: {
          assumptions: ['Using legacy response system'],
          disclaimers: ['This is an estimate. Final rates depend on credit, LTV, points, and occupancy.'],
        },
      };
    }
  } catch (error) {
    console.error('Legacy fallback failed:', error);
  }

  // Ultimate fallback
  return {
    userIntent: 'unknown',
    replyMarkdown: `I'm having trouble processing your request right now. Please try again in a moment.

I can help you with:
- Current mortgage rates
- Mortgage calculators
- Rate alerts
- Statement analysis

What would you like to know?`,
    explainability: {
      assumptions: [],
      disclaimers: ['Service temporarily unavailable'],
    },
  };
}

/**
 * Extract user intent from response
 */
function extractIntentFromResponse(response: string, preIntent: string): UserIntent {
  const lowerResponse = response.toLowerCase();

  if (lowerResponse.includes('rate') && lowerResponse.includes('alert')) {
    return 'rate_alert';
  }
  if (lowerResponse.includes('calculator') || lowerResponse.includes('calculate')) {
    return 'calculator';
  }
  if (lowerResponse.includes('rate')) {
    return 'rates';
  }
  if (lowerResponse.includes('refinance')) {
    return 'refinance';
  }
  if (lowerResponse.includes('dti') || lowerResponse.includes('debt to income')) {
    return 'dti';
  }
  if (lowerResponse.includes('statement')) {
    return 'statement';
  }
  if (preIntent !== 'non_mortgage' && preIntent !== 'unknown') {
    return preIntent as UserIntent;
  }

  return 'general_mortgage';
}

/**
 * Build explainability from tool results
 */
function buildExplainability(
  toolResults: any[],
  actionsTaken: AiResponse['actionsTaken']
): AiResponse['explainability'] {
  const assumptions: string[] = [];
  const calculations: Array<{ name: string; value: string }> = [];
  const whyThis: string[] = [];
  const disclaimers: string[] = [
    'Estimates only. Final rate depends on credit, LTV, points, and occupancy.',
  ];

  for (const result of toolResults) {
    try {
      const data = JSON.parse(result.content);
      
      if (data.assumptions) {
        assumptions.push(...data.assumptions);
      }

      if (data.data) {
        // Extract calculation results
        if (data.data.monthlyPayment) {
          calculations.push({
            name: 'Monthly Payment',
            value: `$${data.data.monthlyPayment.toLocaleString()}`,
          });
        }
        if (data.data.totalInterest) {
          calculations.push({
            name: 'Total Interest',
            value: `$${data.data.totalInterest.toLocaleString()}`,
          });
        }
      }
    } catch (error) {
      // Skip invalid JSON
    }
  }

  if (actionsTaken && actionsTaken.length > 0) {
    whyThis.push('Actions were taken on your behalf as requested.');
  }

  return {
    assumptions: assumptions.length > 0 ? assumptions : ['Using current market rates'],
    calculations: calculations.length > 0 ? calculations : undefined,
    whyThis: whyThis.length > 0 ? whyThis : undefined,
    disclaimers,
  };
}
