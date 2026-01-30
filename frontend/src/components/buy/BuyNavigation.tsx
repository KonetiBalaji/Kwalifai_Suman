'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BuyNavigation() {
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const tabs = [
    { id: 'mortgage-rates', label: 'Mortgage rates today', href: '/buy/mortgage-rates' },
    { id: 'affordability', label: 'Affordability calculator', href: '/buy/Affordability-calculator' },
    { id: 'mortgage', label: 'Mortgage calculator', href: '/buy/mortgage-calculator' },
    { id: 'rent-vs-buy', label: 'Rent vs buy calculator', href: '/buy/rent-buy-calculator' },
  ];

  // Update indicator position when pathname changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.href === pathname);
    if (activeIndex === -1) return;
    
    const activeLink = tabRefs.current[activeIndex];
    
    if (activeLink) {
      const container = activeLink.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        setIndicatorStyle({
          width: linkRect.width,
          left: linkRect.left - containerRect.left,
        });
      }
    }
  }, [pathname]);

  return (
    <div className="flex justify-center mb-8">
      <div className="relative inline-flex items-center gap-2 rounded-full bg-white shadow-sm border border-gray-200 px-2 py-1 overflow-x-auto max-w-full">
        {/* Sliding Background Indicator */}
        {indicatorStyle.width > 0 && (
          <div
            className="absolute bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style={{
              height: 'calc(100% - 8px)',
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
              top: '4px',
            }}
          />
        )}
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.href || (tab.href === '/buy' && pathname === '/buy');
          return (
            <Link
              key={tab.id}
              href={tab.href}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={[
                'relative z-10 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                isActive
                  ? 'text-white'
                  : 'text-gray-700 hover:text-gray-900',
              ].join(' ')}
              aria-pressed={isActive}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
