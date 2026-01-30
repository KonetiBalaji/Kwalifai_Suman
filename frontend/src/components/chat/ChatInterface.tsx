/**
 * @file ChatInterface.tsx
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

'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  explainability?: {
    assumptions: string[];
    calculations?: Array<{ name: string; value: string }>;
    whyThis?: string[];
    disclaimers: string[];
  };
  actionsTaken?: Array<{
    type: string;
    status: 'success' | 'failed';
    referenceId?: string;
    error?: string;
  }>;
}

interface ChatInterfaceProps {
  useLegacy?: boolean;
}

export default function ChatInterface({ useLegacy = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const endpoint = useLegacy
        ? `${API_GATEWAY_URL}/api/chat/message`
        : `${API_GATEWAY_URL}/api/v1/ai/chat`;

      const body = useLegacy
        ? { sessionId: sessionId || undefined, message: messageToSend }
        : { sessionId: sessionId || undefined, message: messageToSend };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('[CHAT] Sending request to:', endpoint);
      console.log('[CHAT] Request body:', body);

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('[CHAT] Request timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw fetchError;
      }

      console.log('[CHAT] Response status:', response.status);
      const data = await response.json();
      console.log('[CHAT] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get response');
      }

      // Handle new AI response format
      const aiMessage: Message = {
        role: 'assistant',
        content: useLegacy ? data.reply : data.replyMarkdown || data.reply || '',
        timestamp: new Date(),
        explainability: useLegacy ? undefined : data.explainability,
        actionsTaken: useLegacy ? undefined : data.actionsTaken,
      };

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('[CHAT] Error:', err);
      console.error('[CHAT] Error name:', err?.name);
      console.error('[CHAT] Error message:', err?.message);
      
      // Don't show error message for aborted requests if component unmounted
      if (err?.name === 'AbortError' && err?.message?.includes('timeout')) {
        const errorMessage = 'Request timed out. The service may be slow. Please try again.';
        setError(errorMessage);
        
        const errorMsg: Message = {
          role: 'assistant',
          content: `I'm having trouble connecting right now. The request timed out.\n\nPlease try again, or check if the AI service is running.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        
        const errorMsg: Message = {
          role: 'assistant',
          content: `I'm having trouble processing your request right now. ${errorMessage}\n\nPlease try again in a moment.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">LOWI AI</h2>
            <p className="text-sm text-blue-100">Your Mortgage Specialist Assistant</p>
          </div>
          {useLegacy && (
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">Legacy Mode</span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">🏡</div>
            <p className="text-lg font-semibold mb-2">Hello! I'm LOWI</p>
            <p className="text-sm">
              I can help you with mortgage rates, calculators, rate alerts, and more!
            </p>
            <p className="text-xs mt-4 text-gray-400">
              Try asking: "What are current mortgage rates?" or "Calculate my payment for $500k at 6.5%"
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                {message.role === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>

              {/* Explainability */}
              {message.explainability && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  {message.explainability.assumptions.length > 0 && (
                    <div className="mb-2">
                      <strong>Assumptions:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {message.explainability.assumptions.map((assumption, i) => (
                          <li key={i}>{assumption}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {message.explainability.disclaimers.length > 0 && (
                    <div className="text-gray-500 italic">
                      {message.explainability.disclaimers.join(' ')}
                    </div>
                  )}
                </div>
              )}

              {/* Actions Taken */}
              {message.actionsTaken && message.actionsTaken.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {message.actionsTaken.map((action, i) => (
                    <div
                      key={i}
                      className={`text-xs p-2 rounded ${
                        action.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {action.status === 'success' ? '✅' : '❌'} {action.type}
                      {action.referenceId && (
                        <span className="ml-2 text-gray-600">ID: {action.referenceId}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse">💭</div>
                <span className="text-sm text-gray-600">LOWI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mb-2">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask LOWI about mortgages, rates, calculators..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
