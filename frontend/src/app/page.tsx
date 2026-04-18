"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF1F8] to-white">
      <nav className="bg-[#1A2744] text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NyayMitra</h1>
          <div className="flex gap-4">
            <Link href="/case">
              <Button>Search Cases</Button>
            </Link>
            <Link href="/chat">
              <Button variant="secondary">Ask AI</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-[#1A2744]">
            Legal Intelligence for Indian Citizens
          </h2>
          <p className="text-lg text-[#6B7A9A] max-w-2xl mx-auto">
            NyayMitra uses AI to help you understand legal cases, find relevant
            court decisions, and get personalized legal guidance.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Link href="/case" className="group">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 group-hover:shadow-lg transition-all">
                <h3 className="text-xl font-semibold text-[#1A2744] mb-3">
                  🔍 Search Cases
                </h3>
                <p className="text-[#6B7A9A]">
                  Search and analyze court cases by CNR number from eCourts NJDG
                  database.
                </p>
              </div>
            </Link>

            <Link href="/chat" className="group">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 group-hover:shadow-lg transition-all">
                <h3 className="text-xl font-semibold text-[#1A2744] mb-3">
                  💬 Chat with AI
                </h3>
                <p className="text-[#6B7A9A]">
                  Get legal insights and answers from Claude, powered by
                  Anthropic.
                </p>
              </div>
            </Link>
          </div>

          <Link href="/dashboard">
            <Button className="mt-8 px-8 py-3 text-lg">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
