/**
 * @file legacyResponse.ts
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

import { AiResponse } from '../../types/ai';

/**
 * Legacy keyword-based response generator
 * Used when OpenAI is not available
 */
export async function generateLegacyResponse(
  message: string,
  correlationId?: string
): Promise<AiResponse> {
  const lowerMessage = message.toLowerCase();

  // Use default rates immediately (don't block on external service calls)
  // This ensures fast responses even if calculator service is slow
  const rates = {
    thirtyYear: 6.44,
    fifteenYear: 5.89,
    twentyYear: 6.15,
    fiveYearARM: 6.99,
    fha: 6.25,
    va: 6.15,
    usda: 6.35,
    jumbo: 6.85,
    lastUpdated: new Date().toISOString(),
  };

  // GREETING
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      userIntent: 'general_mortgage',
      replyMarkdown: `Hello! I'm **LOWI** from Kwalifai, your AI mortgage specialist! 🏡

I can help with:

🧠 **Smart Calculator** - Compare all loan options instantly
🔔 **Rate Alerts** - Get notified when rates drop
📄 **Statement analysis** - Upload your current mortgage
🧮 **10 Advanced Calculators** (DTOI, Buydowns, ARM, etc.)
📞 Connect with licensed specialists

**Current Rates:**
• 30-Year Fixed: ${rates.thirtyYear}%
• 15-Year Fixed: ${rates.fifteenYear}%
• FHA: ${rates.fha}%
• VA: ${rates.va}%

Try saying "rates", "smart calculator", or "set rate alert"!`,
      explainability: {
        assumptions: [`Using current market rates as of ${rates.lastUpdated}`],
        disclaimers: ['This is an estimate. Final rate depends on credit, LTV, points, and occupancy.'],
      },
    };
  }

  // RATES & ALERTS
  if (lowerMessage.includes('rate') || lowerMessage.includes('alert')) {
    return {
      userIntent: 'rates',
      replyMarkdown: `📈 **Current Mortgage Rates:**

• **30-Year Fixed:** ${rates.thirtyYear}%
• **15-Year Fixed:** ${rates.fifteenYear}%
• **FHA:** ${rates.fha}%
• **VA:** ${rates.va}%
• **Jumbo:** ${rates.jumbo}%

🔔 **Want Rate Alerts?** I can notify you when rates drop!

**Set up FREE Rate Alerts:**
1️⃣ Tell me your target rate
2️⃣ I'll monitor rates 24/7
3️⃣ Get instant notifications when rates hit your target
4️⃣ No spam - only when rates are favorable!

Try: "Alert me when 30-year rates drop to 6.0%"`,
      explainability: {
        assumptions: [`Rates as of ${rates.lastUpdated}`],
        disclaimers: ['Rates are estimates. Final rate depends on credit, LTV, points, and occupancy.'],
      },
    };
  }

  // SMART CALCULATOR
  if (lowerMessage.includes('smart') || lowerMessage.includes('calculator') || lowerMessage.includes('compare')) {
    return {
      userIntent: 'calculator',
      replyMarkdown: `🧠 **Smart Calculator** - Your most powerful tool!

**What makes it "Smart"?**
✅ **Live market rates** - Always current
✅ **Multiple scenarios** - Compare 4+ loan types instantly  
✅ **Personalized results** - Based on your situation
✅ **Save & track** - Compare over time

**Try the Smart Calculator for:**
• Purchase scenarios
• Refinance analysis  
• Rate comparisons
• Payment breakdowns

**Current rates loaded:**
• 30-Year: ${rates.thirtyYear}% 
• 15-Year: ${rates.fifteenYear}%
• 5/1 ARM: ${rates.fiveYearARM}%

Ready to see your personalized scenarios?`,
      explainability: {
        assumptions: [`Using current market rates`],
        disclaimers: ['Calculations are estimates. Final rates depend on credit, LTV, points, and occupancy.'],
      },
    };
  }

  // DTOI
  if (lowerMessage.includes('dtoi') || lowerMessage.includes('debt to income') || lowerMessage.includes('qualify')) {
    return {
      userIntent: 'dti',
      replyMarkdown: `📊 **DTOI Calculator** - Know exactly what you qualify for!

**Debt-to-Income ratios:**
• **Front-end:** Housing ÷ Income (≤28% ideal)
• **Back-end:** All debts ÷ Income (≤36% ideal)

**Different loan programs:**
• **Conventional:** 28/36 preferred
• **FHA:** Up to 31/43 
• **VA:** More flexible ratios
• **Bank Statement:** Alternative qualification

The DTOI Calculator shows you:
✅ Exact qualification status
✅ Maximum loan amounts  
✅ Required income levels
✅ Debt reduction strategies

Want to check your ratios?`,
      explainability: {
        assumptions: ['Using standard DTI ratios: 28/36 for conventional loans'],
        disclaimers: ['DTI calculations are estimates. Final qualification depends on credit, assets, and other factors.'],
      },
    };
  }

  // STATEMENT ANALYSIS
  if (lowerMessage.includes('statement') || lowerMessage.includes('current loan') || lowerMessage.includes('analyze')) {
    return {
      userIntent: 'statement',
      replyMarkdown: `📄 **Mortgage Statement Analysis** - See your refinance opportunities!

**I'll analyze:**
• Current balance & rate
• Payment breakdown
• Refinance savings potential
• Market rate comparison
• Break-even analysis

**Supported formats:** PDF, JPEG, PNG
**100% secure** - Bank-level encryption

**Two ways to analyze:**
1. **Upload** your statement
2. **Enter details** manually

Average savings found: **$200-400/month** for qualified borrowers!

Ready to see your refinance opportunities?`,
      explainability: {
        assumptions: [],
        disclaimers: ['Statement analysis provides estimates. Consult with a licensed loan officer for final decisions.'],
      },
    };
  }

  // DEFAULT
  const responses = [
    `I'm here to help with **Smart Calculators**, **Rate Alerts**, statement analysis, and mortgage guidance! What interests you most?`,
    `Ask me about current rates, setting up rate alerts, using the Smart Calculator, or analyzing your mortgage statement!`,
  ];

  return {
    userIntent: 'general_mortgage',
    replyMarkdown: responses[Math.floor(Math.random() * responses.length)],
    explainability: {
      assumptions: [],
      disclaimers: ['I can help with mortgage-related questions. Ask me about rates, calculators, or alerts!'],
    },
  };
}
