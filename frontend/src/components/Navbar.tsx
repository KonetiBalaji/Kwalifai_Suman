/**
 * @file Navbar.tsx
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FEATURES } from '../config/features';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  };

  // Handle navbar link click - redirect to login if auth required and not authenticated
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (FEATURES.REQUIRE_AUTH_FOR_NAVBAR && !isAuthenticated()) {
      e.preventDefault();
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', href);
      router.push('/login');
    }
  };

  const calculatorLinks = [
    { label: 'Smart', href: '/calculators/smart' },
    { label: 'Payment', href: '/calculators/payment' },
    { label: 'DTOI', href: '/calculators/dtoi' },
    { label: 'Buydown', href: '/calculators/buydown' },
    { label: 'ARM', href: '/calculators/arm' },
    { label: 'Amortization', href: '/calculators/amortization' },
    { label: 'Borrowing', href: '/calculators/borrowing' },
    { label: '15vs30', href: '/calculators/15vs30' },
    { label: 'Refinance', href: '/calculators/refinance' },
    { label: 'Extra Payment', href: '/calculators/extra-payment' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setCalculatorsOpen(false);
    }
  };

  const toggleCalculators = () => {
    setCalculatorsOpen(!calculatorsOpen);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCalculatorsOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl text-gray-900" onClick={closeMenus}>
              Kwalifai
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/buy"
              onClick={(e) => handleNavLinkClick(e, '/buy')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
            >
              Buy
            </Link>
            <Link
              href="/rate-alerts"
              onClick={(e) => handleNavLinkClick(e, '/rate-alerts')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
            >
              Rate Alerts
            </Link>

            {/* Smart Calculators Dropdown */}
            <div className="relative group">
              <div
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                aria-haspopup="true"
                aria-label="Smart Calculators menu"
              >
                Smart Calculators
                <span className="ml-1 text-xs"></span>
              </div>
              <div
                className="absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                role="menu"
              >
                <div className="py-1">
                  {calculatorLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavLinkClick(e, link.href)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      role="menuitem"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/statement-analysis"
              onClick={(e) => handleNavLinkClick(e, '/statement-analysis')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
            >
              Statement Analysis
            </Link>
            <Link
              href="/market-news"
              onClick={(e) => handleNavLinkClick(e, '/market-news')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
            >
              Market News
            </Link>
          </div>

          {/* Right side - Login/Register */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              <Link
                href="/buy"
                onClick={(e) => {
                  handleNavLinkClick(e, '/buy');
                  closeMenus();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Buy
              </Link>
              <Link
                href="/rate-alerts"
                onClick={(e) => {
                  handleNavLinkClick(e, '/rate-alerts');
                  closeMenus();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Rate Alerts
              </Link>

              {/* Smart Calculators in mobile */}
              <div>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded flex items-center justify-between"
                  onClick={toggleCalculators}
                  aria-expanded={calculatorsOpen}
                  aria-label="Smart Calculators menu"
                >
                  <span>Smart Calculators</span>
                  <span>{calculatorsOpen ? '▲' : '▼'}</span>
                </button>
                {calculatorsOpen && (
                  <div className="pl-4 py-2 space-y-1">
                    {calculatorLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                          handleNavLinkClick(e, link.href);
                          closeMenus();
                        }}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/statement-analysis"
                onClick={(e) => {
                  handleNavLinkClick(e, '/statement-analysis');
                  closeMenus();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Statement Analysis
              </Link>
              <Link
                href="/market-news"
                onClick={(e) => {
                  handleNavLinkClick(e, '/market-news');
                  closeMenus();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Market News
              </Link>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded text-center"
                  onClick={closeMenus}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-full text-center hover:bg-blue-700 transition-all duration-300"
                  onClick={closeMenus}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
