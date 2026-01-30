/**
 * @file Footer.tsx
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

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0 gap-x-16 md:gap-x-24 md:justify-items-center">
          {/* Product Links */}
          <div className="w-full md:w-auto">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Product
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-xs hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-xs hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/education"
                  className="text-xs hover:text-white transition-colors"
                >
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/get-started"
                  className="text-xs hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="w-full md:w-auto">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Company
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-xs hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="w-full md:w-auto">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Legal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-xs hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-xs hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-center text-xs text-gray-400">
            © 2026 Kwalifai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
