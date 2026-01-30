/**
 * @file LowiChatPanel.tsx
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
import { X, Send, Sparkles } from 'lucide-react';

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

interface LowiChatPanelProps {
  onClose: () => void;
  useLegacy?: boolean;
}

export default function LowiChatPanel({ onClose, useLegacy = false }: LowiChatPanelProps) {
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

  // Focus input when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '48px';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
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

      const data = await response.json();

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

  const quickQuestions = [
    "What are current mortgage rates?",
    "Calculate payment for $500k at 6.5%",
    "Compare 15 vs 30 year loans"
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-t-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Lowi AI</h2>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
              Online now
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8 px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Hello! I'm Lowi AI</h3>
            <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
              Your mortgage specialist assistant. I can help with rates, calculations, alerts, and more!
            </p>
            
            {/* Quick Action Buttons */}
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-3 text-center">Try asking:</p>
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm text-gray-700 hover:text-blue-700 shadow-sm hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-white text-gray-800 shadow-md border border-gray-100'
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

              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start fade-in">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">Lowi is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 slide-in-from-top-2">
          <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-3 shadow-sm">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
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
              placeholder="Ask Lowi about mortgages, rates, calculators..."
              className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              rows={1}
              disabled={loading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center justify-center"
            aria-label="Send message"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Shift+Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}
