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

import { useState, FormEvent } from 'react';
import { Mail, Clock, MapPin } from 'lucide-react';
import PageShell from '../../components/PageShell';
import SectionCard from '../../components/SectionCard';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <PageShell
      title="Contact Us"
      subtitle="Have questions? We're here to help. Send us a message and we'll get back to you."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <SectionCard>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            {submitted && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                Contact form submission coming soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </SectionCard>

          {/* Contact Details & Map */}
          <div className="space-y-6">
            <SectionCard>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Support Email</div>
                    <div className="text-sm text-gray-600">support@kwalifai.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Response Time</div>
                    <div className="text-sm text-gray-600">Typically within 24–48 hours</div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              </div>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Map / Location</div>
                  <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
