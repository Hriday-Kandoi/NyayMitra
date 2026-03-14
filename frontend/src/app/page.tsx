"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Bot,
  FileText,
  Search,
  ChevronRight,
  Scale,
} from "lucide-react";

export default function Home() {
  const [caseNumber, setCaseNumber] = useState("");

  const handleTrackCase = () => {
    if (caseNumber.trim()) {
      // Navigate to track case page with case number
      window.location.href = `/track-case?caseNumber=${encodeURIComponent(caseNumber)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#1A2744" }}
      >
        <div className="mx-auto max-w-5xl">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Justice should not require a law degree
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Track your court cases in real-time and get instant AI-powered legal guidance. All from one place, completely free to start.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
            <div className="w-full sm:flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-5 w-5" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Enter case number or case ID..."
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrackCase()}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E07B39] transition-all"
              />
            </div>
            <button
              onClick={handleTrackCase}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: "#E07B39" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#c96a2a")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#E07B39")
              }
            >
              Track Case
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link
              href="/ai-advisor"
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-center"
            >
              Chat with AI Advisor
            </Link>
            <Link
              href="/documents"
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-center"
            >
              Upload a Document
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#E07B39" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "5 Cr+", label: "Pending Cases" },
              { value: "25", label: "High Courts Connected" },
              { value: "∞", label: "AI Powered Guidance" },
              { value: "100%", label: "Free to Start" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Empowering Indian citizens with legal technology
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Live Case Tracking",
                description:
                  "Monitor your court cases in real-time with instant updates on hearing dates, judgments, and case status.",
              },
              {
                icon: Bot,
                title: "AI Legal Advisor",
                description:
                  "Get personalized legal guidance powered by artificial intelligence. Available 24/7 to answer your questions.",
              },
              {
                icon: FileText,
                title: "Document Interpreter",
                description:
                  "Upload legal documents and get instant plain-language explanations of complex legal terms and clauses.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl border-2 border-gray-200 hover:border-[#1A2744] transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-[#E07B39]/10"
                    style={{ backgroundColor: "#E07B39/10" }}
                  >
                    <Icon
                      className="h-6 w-6 transition-colors"
                      style={{ color: "#E07B39" }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#1A2744" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B39] rounded-md"
              aria-label="NyayMitra — home"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#E07B39" }}
              >
                <Scale className="h-5 w-5 text-white" strokeWidth={2.2} />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Nyay<span style={{ color: "#E07B39" }}>Mitra</span>
              </span>
            </Link>

            {/* Copyright */}
            <p className="text-slate-400 text-center md:text-right">
              © 2026 NyayMitra. Empowering justice for all Indians.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
