/**
 * @file HowItWorks.tsx
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

import { useEffect, useRef, useState } from 'react';

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [headingAnimation, setHeadingAnimation] = useState({
    showDots: false,
    showQuestion: false,
  });

  const steps = [
    {
      number: '01',
      title: 'Sign up in under a minute',
      description: 'Create your account with just your email. No credit check, no SSN, no commitment. Start exploring immediately.',
    },
    {
      number: '02',
      title: 'Compare loan scenarios',
      description: 'Use our calculators to see how different rates, terms, and down payments affect your monthly payment and total costs. Save multiple scenarios to compare later.',
    },
    {
      number: '03',
      title: 'Set rate alerts',
      description: 'Tell us your target rate, and we\'ll notify you when mortgage rates drop to that level. You decide when to act, we just give you the information.',
    },
    {
      number: '04',
      title: 'Take decision with confidence',
      description: 'You\'ll have clear numbers, side-by-side comparisons, and a complete picture of your options. When you\'re ready to move forward, you\'ll know exactly what to look for, and what questions to ask.',
    },
  ];

  useEffect(() => {
    const resetAnimation = () => {
      hasAnimatedRef.current = false;
      setIsVisible(false);
      setActiveStep(0);
      setHeadingAnimation({ showDots: false, showQuestion: false });
    };

    const startAnimation = () => {
      if (hasAnimatedRef.current) return; // Prevent multiple animations
      hasAnimatedRef.current = true;
      
      setIsVisible(true);
      
      // Start heading animation
      setTimeout(() => {
        setHeadingAnimation({ showDots: true, showQuestion: false });
      }, 600);
      
      // Show question mark after dots
      setTimeout(() => {
        setHeadingAnimation({ showDots: true, showQuestion: true });
      }, 1600);
    };

    // Check if we're navigating via hash
    const checkHash = () => {
      if (window.location.hash === '#how-it-works') {
        // Reset animation state when navigating via hash
        resetAnimation();
        
        // Small delay to ensure scroll has happened
        setTimeout(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
              startAnimation();
            }
          }
        }, 300);
      }
    };

    // Check hash on mount
    checkHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            startAnimation();
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('hashchange', checkHash);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timers: NodeJS.Timeout[] = [];
    
    // Animate each step sequentially
    for (let i = 0; i < 4; i++) {
      const timer = setTimeout(() => {
        setActiveStep(i + 1);
      }, i * 800); // 800ms delay between each step
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            How It Works
            {headingAnimation.showDots && (
              <span className="inline-block animate-fade-in">
                <span className="inline-block animate-dot-1">.</span>
                <span className="inline-block animate-dot-2">.</span>
              </span>
            )}
            {headingAnimation.showQuestion && (
              <span className="inline-block animate-fade-in">?</span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isAnimating = activeStep >= stepNumber;
            const isActive = activeStep === stepNumber;
            
            return (
              <div key={index} className="text-center px-4 sm:px-0">
                <div className="relative inline-block mb-4">
                  <div className="text-5xl sm:text-6xl text-blue-100 number-outline">
                    {step.number}
                  </div>
                  {isAnimating && (
                    <div className={`text-5xl sm:text-6xl text-blue-600 number-fill ${isActive ? 'number-fill-active' : 'number-fill-complete'}`}>
                      {step.number}
                    </div>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
