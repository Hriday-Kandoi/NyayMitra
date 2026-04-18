"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  Brain,
  FileStack,
  Bell,
  Menu,
  X,
  Check,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A2744] border-b border-[#2a3f5f]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              Nyay<span className="text-[#E07B39]">Mitra</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-white hover:text-[#E07B39] transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/case"
              className="text-white hover:text-[#E07B39] transition-colors text-sm font-medium"
            >
              Track Case
            </Link>
            <Link
              href="/chat"
              className="text-white hover:text-[#E07B39] transition-colors text-sm font-medium"
            >
              AI Advisor
            </Link>
            <Link
              href="/documents"
              className="text-white hover:text-[#E07B39] transition-colors text-sm font-medium"
            >
              Documents
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-[#2a3f5f] rounded-lg transition-colors">
              <Bell size={20} className="text-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#E07B39] flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-[#2a3f5f] rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2a3f5f] border-t border-[#3a5f7f] px-6 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block text-white hover:text-[#E07B39] transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/case"
              className="block text-white hover:text-[#E07B39] transition-colors font-medium"
            >
              Track Case
            </Link>
            <Link
              href="/chat"
              className="block text-white hover:text-[#E07B39] transition-colors font-medium"
            >
              AI Advisor
            </Link>
            <Link
              href="/documents"
              className="block text-white hover:text-[#E07B39] transition-colors font-medium"
            >
              Documents
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#1A2744] via-[#1A2744] to-[#2a3f5f]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Cases,{" "}
            <br />
            <span className="text-[#E07B39]">Simplified</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7A9A] mb-12 max-w-2xl mx-auto leading-relaxed">
            Track your court cases, get instant AI legal advice, and stay informed about every hearing.
            Built for Indian citizens who deserve clarity in the law.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/case" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Track Your Case
              </Button>
            </Link>
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Talk to AI Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-[#EEF1F8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-4">
              Powerful Features Built for You
            </h2>
            <p className="text-lg text-[#6B7A9A] max-w-2xl mx-auto">
              Everything you need to understand and track your legal matters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Case Tracking",
                description:
                  "Monitor your cases in real-time with instant updates on hearings, orders, and status changes",
              },
              {
                icon: Brain,
                title: "AI Legal Advisor",
                description:
                  "Get instant, personalized legal insights powered by advanced AI trained on Indian law",
              },
              {
                icon: FileStack,
                title: "Document Analysis",
                description:
                  "Upload and understand complex legal documents with AI-powered summaries and explanations",
              },
              {
                icon: Bell,
                title: "Hearing Alerts",
                description:
                  "Never miss a hearing date with automatic reminders and notification updates",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-200 hover:translate-y-[-4px] border border-transparent hover:border-[#E07B39]/20 group"
              >
                <div className="w-14 h-14 bg-[#EEF1F8] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#E07B39] transition-all duration-200">
                  <feature.icon
                    size={28}
                    className="text-[#E07B39] group-hover:text-white transition-colors duration-200"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#1A2744] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7A9A] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#6B7A9A]">Three simple steps to get started</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Enter Your Case Details",
                description:
                  "Search by CNR number or case ID to instantly access your case information from Indian courts",
              },
              {
                step: 2,
                title: "Get AI Legal Insights",
                description:
                  "Our AI analyzes your case and provides personalized legal advice and explanations",
              },
              {
                step: 3,
                title: "Stay Updated",
                description:
                  "Receive real-time alerts for hearing dates, orders, and important case updates",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 md:gap-8">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#E07B39] text-white flex items-center justify-center font-bold text-lg md:text-xl">
                    {item.step}
                  </div>
                  {idx < 2 && (
                    <div className="w-1 h-12 md:h-16 bg-[#E07B39]/20 mx-auto mt-4"></div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-2 md:pt-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[#1A2744] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7A9A] text-base md:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 px-6 bg-[#EEF1F8] border-y border-[#D4D8E4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-[#6B7A9A] font-medium">
              ✓ Trusted by over 50,000+ Indian citizens
            </p>
            <p className="text-sm text-[#6B7A9A] mt-2">
              Integrated with eCourts and official Indian court systems
            </p>
          </div>

          {/* Court Logos Placeholder */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-4">
            {["Supreme Court", "High Courts", "District Courts", "eCourts"].map((court) => (
              <div key={court} className="flex items-center gap-2 text-[#6B7A9A] text-sm font-medium">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#D4D8E4] flex items-center justify-center">
                  <Check size={20} className="text-[#E07B39]" />
                </div>
                <span>{court}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-[#1A2744]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Tracking Your Case Today
          </h2>
          <p className="text-lg text-[#6B7A9A] mb-10">
            Join thousands of Indians who are taking control of their legal matters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/case" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Search Your Case
              </Button>
            </Link>
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Ask AI Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1623] text-[#6B7A9A] py-16 px-6 border-t border-[#1A2744]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Nyay<span className="text-[#E07B39]">Mitra</span>
              </h3>
              <p className="text-sm leading-relaxed">
                Making Indian law accessible and understandable for every citizen.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/case" className="hover:text-[#E07B39] transition-colors">
                    Case Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-[#E07B39] transition-colors">
                    AI Advisor
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="hover:text-[#E07B39] transition-colors">
                    Documents
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#E07B39] transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#1A2744] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2026 NyayMitra. All rights reserved.</p>
            <p className="text-center md:text-right">
              Made with <span className="text-[#E07B39]">❤️</span> for India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
