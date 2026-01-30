/**
 * @file LowiFloatingWidget.tsx
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

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import LowiChatPanel from './LowiChatPanel';

const STORAGE_KEY = 'lowi-widget-open';

export default function LowiFloatingWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide widget on login and register pages
  const shouldHide = pathname === '/login' || pathname === '/register';

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState === 'true') {
      setIsOpen(true);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isOpen.toString());
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't render anything on login/register pages
  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* Floating Button - Only show when drawer is closed */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
          {/* Pulsating ring animation */}
          <div className="absolute inset-0 -m-2 rounded-full bg-blue-600 animate-pulse-ring"></div>
          <button
            onClick={handleToggle}
            className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            aria-label="Open Lowi AI chat"
          >
            <div className="relative">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* Online status dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-semibold text-xs sm:text-sm">Ask Lowi AI</span>
          </button>
        </div>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <>
          {/* Backdrop for mobile (optional, subtle) */}
          <div
            className="fixed inset-0 bg-black/10 z-[9997] sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="fixed bottom-0 right-0 z-[9998] w-[calc(100%-32px)] sm:w-[420px] h-[600px] sm:h-[620px] max-h-[90vh] mx-4 sm:mx-0 mb-4 sm:mb-0 transform transition-all duration-300 ease-out animate-[slideUp_0.3s_ease-out]">
            <LowiChatPanel onClose={handleClose} />
          </div>
        </>
      )}
    </>
  );
}
