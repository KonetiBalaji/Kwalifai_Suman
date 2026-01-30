/**
 * @file page.tsx
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

import { useState } from 'react';
import PageShell from '../../components/PageShell';

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<'glossary' | 'process' | 'programs' | 'faq'>('glossary');

  return (
    <PageShell
      title="Mortgage Learning Hub"
      subtitle="Clear, no-jargon guides to help you understand mortgages, payments, and refinance decisions."
    >
      <div className="space-y-8">
        {/* Top segmented navigation */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm border border-gray-200 px-2 py-1 overflow-x-auto max-w-full">
            {[
              { id: 'glossary' as const, label: 'Mortgage Glossary' },
              { id: 'process' as const, label: 'Home Buying Process' },
              { id: 'programs' as const, label: 'Loan Programs' },
              { id: 'faq' as const, label: 'Frequently Asked Questions' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'glossary' && <MortgageGlossarySection />}
        {activeTab === 'process' && <HomeBuyingProcessSection />}
        {activeTab === 'programs' && <LoanProgramsSection />}
        {activeTab === 'faq' && <FaqSection />}
      </div>
    </PageShell>
  );
}

function MortgageGlossarySection() {
  const terms = [
    {
      title: 'Rate Buydown',
      description:
        'A financing technique where you pay extra upfront (permanent) or the seller pays (temporary) to reduce your interest rate.',
      example: 'Example: 3-2-1 buydown reduces rate by 3%, 2%, 1% for the first three years.',
    },
    {
      title: 'DTOI (Debt-to-Income)',
      description:
        'The percentage of your monthly gross income that goes toward debt payments. Critical for loan approval.',
      example: 'Example: $600 debt payments ÷ $5,000 income = 12% DTOI ratio.',
    },
    {
      title: 'PITI',
      description:
        'Principal, Interest, Taxes, and Insurance – the four components of your monthly mortgage payment.',
      example: 'Example: $1,500 P&I + $400 taxes + $150 insurance = $2,050 PITI.',
    },
    {
      title: 'APR (Annual Percentage Rate)',
      description:
        'The true cost of your loan including interest rate plus fees, expressed as a yearly rate.',
      example: 'Example: 6.5% interest rate with fees might have 6.8% APR.',
    },
    {
      title: 'Private Mortgage Insurance (PMI)',
      description:
        'Insurance you pay if your down payment is less than 20%, protecting the lender if you default.',
      example: 'Example: $300K loan with 10% down ≈ $200–300/month PMI.',
    },
    {
      title: 'Escrow Account',
      description:
        'An account where your lender holds money for property taxes and insurance, paying them when due.',
      example: 'Example: $400/month collected to cover a $4,800 annual tax bill.',
    },
    {
      title: 'Closing Costs',
      description:
        'Fees and expenses you pay to finalize your mortgage, typically 2–5% of the loan amount.',
      example: 'Example: $400K loan = $8,000–20,000 in closing costs.',
    },
    {
      title: 'Loan-to-Value (LTV)',
      description:
        "The loan amount divided by the home's value, expressed as a percentage.",
      example: 'Example: $320K loan ÷ $400K home value = 80% LTV.',
    },
    {
      title: 'Points (Discount Points)',
      description:
        'Upfront fees paid to reduce your interest rate. One point equals 1% of the loan amount.',
      example: 'Example: 2 points on a $400K loan = $8,000 for roughly a 0.5% rate reduction.',
    },
    {
      title: 'Amortization',
      description:
        'The gradual repayment of your loan through regular payments, with interest decreasing and principal increasing over time.',
      example: 'Example: Early payments are heavily interest (for example, 80% interest, 20% principal).',
    },
    {
      title: 'ARM (Adjustable Rate Mortgage)',
      description:
        'A loan with an interest rate that can change after an initial fixed period based on market conditions.',
      example: 'Example: 5/1 ARM is fixed for 5 years, then adjusts annually.',
    },
    {
      title: 'Underwriting',
      description:
        'The process where lenders evaluate your credit, income, assets, and the property to approve your loan.',
      example: 'Example: Reviewing pay stubs, tax returns, bank statements, and the appraisal.',
    },
    {
      title: 'Pre-Qualification vs Pre-Approval',
      description:
        'Pre-qualification is a quick estimate; pre-approval involves documentation and a credit check.',
      example: 'Example: Pre-qualification ~10 minutes; pre-approval ~1–3 days with documentation.',
    },
    {
      title: 'Fixed vs Adjustable Rate',
      description:
        'Fixed rates stay the same for the full term; adjustable rates can change over time.',
      example: 'Example: 30-year fixed at 6.5% vs 5/1 ARM at 5.5% that adjusts after 5 years.',
    },
    {
      title: 'Conforming vs Jumbo Loans',
      description:
        'Conforming loans meet standard loan limits; jumbo loans exceed them and often have stricter requirements.',
      example: 'Example: In 2025, conforming limit is about $766,550 in many areas, higher in expensive markets.',
    },
    {
      title: 'Rate Lock',
      description:
        'Agreement to hold your interest rate for a set period while your loan is processed.',
      example:
        'Example: A 30–60 day rate lock protects you from rate increases while your loan is approved.',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Essential Mortgage Terms
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Understanding these key terms will help you navigate the mortgage process with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term) => (
            <article
              key={term.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-2 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-blue-800">{term.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{term.description}</p>
              <p className="mt-2 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 leading-relaxed">
                {term.example}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          The 10 calculators and the formulas behind them
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Our calculator engine in the frontend is a TypeScript port of the original{' '}
          <code>server.js</code> logic. Here&apos;s how each calculator works in plain language, with simple examples.
        </p>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900">1. Payment calculator</h3>
            <p>
              Uses the standard fixed-rate mortgage formula. We convert the annual rate to a monthly rate,
              compute the number of payments, then solve for a fixed monthly payment that fully pays off
              the loan over the term.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> $400,000 loan at 6.5% for 30 years ⇒ monthly payment is
              roughly $2,528 for principal &amp; interest.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">2. Smart multi-scenario calculator</h3>
            <p>
              Runs the same payment math across several loan types (30-year, 15-year, 20-year, ARM) using
              a set of current market rates, then compares monthly payment, total interest, and total paid.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> For a $500,000 home with $100,000 down, you can instantly
              see the payment and lifetime interest differences between 30-year, 15-year, 20-year, and ARM options.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">3. DTOI (Debt-to-Income) calculator</h3>
            <p>
              Computes front-end ratio = housing costs ÷ income and back-end ratio = (housing + other debts) ÷ income,
              then compares them to common lender thresholds (for example 28/36 or FHA 31/43) to label qualification.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> $2,000 housing costs ÷ $7,000 income = 28.6% front-end DTOI;
              adding $500 other debts gives 35.7% back-end DTOI.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">4. Rate buydown (permanent &amp; temporary)</h3>
            <p>
              Permanent buydown reduces the interest rate by 0.25% per point, recomputes the payment, and calculates
              break-even months as points cost ÷ monthly savings. Temporary buydown applies lower rates for the early
              years (3-2-1, 2-1, etc.) and compares those payments to the original schedule.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> Paying 2 points ($8,000 on a $400,000 loan) might drop the
              payment by about $150/month ⇒ break-even in ~54 months ($8,000 ÷ $150).
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">5. ARM payment calculator</h3>
            <p>
              Calculates the initial payment at the starting rate and a maximum payment at the highest allowed rate
              (initial rate plus lifetime cap, limited by a maximum interest rate) to show best- and worst-case payments.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> $400,000 at 5.5% (5/1 ARM) ⇒ initial payment ≈ $2,271; if
              the rate later hits an 8.5% cap, max payment could be around $3,077.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">6. Amortization schedule</h3>
            <p>
              Builds a month-by-month schedule: interest = balance × monthly rate, principal = payment − interest,
              new balance = old balance − principal. Extra payments increase principal paid and shorten the term.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> On a $400,000 loan, the first payment might be about
              $2,528 with roughly $2,167 interest and $361 principal; adding $200 extra each month speeds up payoff.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">7. Borrowing power calculator</h3>
            <p>
              Starts from target DTIs (for example 28% and 31%), backs into affordable monthly payments after
              existing debts, solves for the loan amount using the payment formula, then adds your down payment
              percentage to estimate a maximum home price.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> $8,000 income and $1,000 debts might support a conservative
              housing budget near $1,240/month, which could translate to roughly a $400,000 loan and $500,000 home
              price with 20% down.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">8. 15 vs 30-year comparison</h3>
            <p>
              Runs the payment formula for 15-year and 30-year terms, then compares monthly payments,
              total interest, and total paid. The difference in total interest shows long-term savings.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> $400,000 at 6.0% ⇒ 30-year payment ≈ $2,398 with about
              $463K interest; 15-year payment ≈ $3,376 with about $208K interest—around $255K saved.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">9. Refinance calculator</h3>
            <p>
              Treats the new loan as current balance plus closing costs, computes the new payment,
              then monthly savings = current payment − new payment. Break-even months are closing costs ÷ monthly savings
              when savings are positive.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> Current payment $2,600 → new payment $2,200 with $6,000
              closing costs ⇒ save $400/month and break-even in about 15 months.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">10. Extra payment impact</h3>
            <p>
              Compares two amortization schedules (with and without extra monthly payments) and reports interest saved
              and time saved, both in months and as years + months.
            </p>
            <p className="mt-1 text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
              <span className="font-medium">Example:</span> Adding $300/month extra on a $400,000 30-year loan can cut
              the term by several years and save tens of thousands of dollars in interest.
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
}

function HomeBuyingProcessSection() {
  const steps = [
    {
      title: 'Check Your Credit & Finances',
      description:
        'Review credit report, calculate debt-to-income ratio, and determine how much you can afford. Use our DTOI calculator to check your qualification status!',
    },
    {
      title: 'Get Pre-Qualified',
      description:
        'Quick estimate of loan amount based on basic financial information. Takes just minutes with our AI system and gives you a starting point.',
    },
    {
      title: 'Shop for Homes',
      description:
        'Work with a realtor to find homes within your budget. Consider rate buydowns if seller offers assistance - our calculator can show the savings!',
    },
    {
      title: 'Get Pre-Approved',
      description:
        'Full loan application with documentation review. Provides stronger negotiating position with sellers and locks in your borrowing capacity.',
    },
    {
      title: 'Make an Offer',
      description:
        'Submit offer with financing contingency. Consider asking seller to pay for temporary rate buydown or help with closing costs.',
    },
    {
      title: 'Home Inspection & Appraisal',
      description:
        'Professional inspection for defects, lender orders appraisal to confirm home value matches loan amount. Critical protection steps.',
    },
    {
      title: 'Finalize Your Loan',
      description:
        'Complete underwriting, lock interest rate, review loan terms. Consider discount points for permanent rate reduction if staying long-term.',
    },
    {
      title: 'Close on Your Home',
      description:
        'Final walkthrough, sign loan documents, pay closing costs, and receive keys to your new home! Congratulations on your achievement!',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Your Home Buying Journey
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Follow these 8 essential steps to successfully purchase your home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={[
              'bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3',
              'transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md',
              index % 2 === 0 ? 'md:-translate-y-1' : 'md:translate-y-1',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoanProgramsSection() {
  const programs = [
    {
      title: 'Conventional Loans',
      description:
        'Not government-backed. Require roughly 3–20% down, good credit (around 620+), and prefer 28/36 debt ratios.',
      bestFor:
        'Strong credit, stable income, planning to stay long-term, and avoiding long-term mortgage insurance.',
    },
    {
      title: 'FHA Loans',
      description:
        'Government-backed loans allowing 3.5% down with 580+ credit scores. Higher debt ratios acceptable (31/43). Mortgage insurance required.',
      bestFor: 'First-time buyers, lower credit scores, limited down payment, higher debt ratios.',
    },
    {
      title: 'VA Loans',
      description:
        'For eligible military veterans and active duty. No down payment, no PMI, and competitive rates. Certificate of eligibility required.',
      bestFor:
        'Veterans and military families with VA eligibility who want no down payment and no mortgage insurance.',
    },
    {
      title: 'USDA Loans',
      description:
        'For rural and certain suburban areas. No down payment, income limits apply, and the property must be in an eligible area. Guarantee fee required.',
      bestFor:
        'Rural/suburban buyers with moderate income, no down payment, and first-time buyers in eligible locations.',
    },
    {
      title: 'Jumbo Loans',
      description:
        'For loan amounts exceeding conforming limits (around $766,550+ in many areas). Often stricter requirements and sometimes higher rates.',
      bestFor:
        'High-value homes, strong financials, larger down payments, and excellent credit profiles.',
    },
    {
      title: 'First-Time Buyer Programs',
      description:
        'State and local programs offering down payment assistance, grants, or favorable terms for qualified first-time buyers.',
      bestFor:
        'First-time buyers with moderate income who need help with up-front down payment and closing costs.',
    },
    {
      title: 'Bank Statement Loans',
      description:
        "For self-employed borrowers who cannot easily document income through tax returns, using bank statements instead to prove cash flow.",
      bestFor:
        'Self-employed borrowers and business owners with strong deposits but complex tax returns.',
    },
    {
      title: 'Asset Depletion Loans',
      description:
        'Qualify based on assets rather than traditional income, often used by retirees or high-net-worth borrowers.',
      bestFor:
        'Retirees or asset-rich borrowers whose income alone does not fully reflect their ability to repay.',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Popular Loan Programs
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Choose the right loan program based on your situation and qualifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => (
          <article
            key={program.title}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-blue-800">{program.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{program.description}</p>
            <p className="text-xs text-gray-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 leading-relaxed">
              <span className="font-medium">Best for:</span> {program.bestFor}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's the difference between pre-qualification and pre-approval?",
      answer:
        'Pre-qualification is a quick estimate based on basic financial information you provide (income, debts, assets) and can be done in minutes. '
        + 'Pre-approval involves submitting a full application with documentation and a credit check, providing a more accurate loan amount and stronger negotiating position with sellers.',
    },
    {
      question: 'How do rate buydowns work and when should I consider them?',
      answer:
        'Rate buydowns trade upfront cost or seller credits for lower payments in the early years or for the full term. '
        + 'They can make sense if you will keep the loan long enough to reach break-even on the cost, or when a builder or seller is paying for the buydown.',
    },
    {
      question: 'What DTOI ratio do I need to qualify for a mortgage?',
      answer:
        'Many conventional loans target around 28% front-end and 36% back-end DTOI, while FHA and other programs may allow higher ratios (for example 31/43). '
        + 'Our DTOI calculator shows how your numbers compare to these benchmarks in real time.',
    },
    {
      question: 'How much should I put down on a house?',
      answer:
        'A 20% down payment avoids PMI and lowers your monthly payment, but many buyers purchase successfully with 3–5% down. '
        + 'The right amount depends on your savings, comfort with payments, and other financial goals such as reserves and retirement.',
    },
    {
      question: 'Should I choose a 15-year or 30-year mortgage?',
      answer:
        'A 15-year loan usually has a higher monthly payment but much less total interest, while a 30-year loan keeps payments lower and more flexible. '
        + 'The 15 vs 30 calculator quantifies the trade-off for your specific loan amount and rates.',
    },
    {
      question: 'What credit score do I need for a mortgage?',
      answer:
        'Many conventional programs start around 620+, while FHA and other options can be more flexible. '
        + 'Higher scores generally unlock better interest rates, lower mortgage insurance, and more program choices.',
    },
    {
      question: 'What are closing costs and how much should I expect?',
      answer:
        'Closing costs typically run 2–5% of the loan amount and include lender fees, third-party fees (appraisal, title, escrow), and prepaid taxes and insurance. '
        + 'You can sometimes negotiate seller credits or lender credits to offset a portion of these costs.',
    },
    {
      question: 'When should I consider refinancing my mortgage?',
      answer:
        'Refinancing can make sense when you can lower your rate, payment, or term enough to recoup closing costs within a time frame that fits your plans. '
        + 'Our refinance calculator shows new payment, monthly savings, and break-even months so you can decide with data instead of guesswork.',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Get answers to the most common mortgage questions so you can move forward with confidence.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-expanded={isOpen}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="ml-4 text-xs sm:text-sm text-gray-500">
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 text-sm text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
