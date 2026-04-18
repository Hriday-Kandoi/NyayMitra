"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWindow } from "@/components/ai/ChatWindow";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A2744]">
            AI Legal Advisor
          </h1>
          <p className="text-gray-600 mt-2">
            Get instant legal insights powered by AI
          </p>
          {caseId && (
            <p className="text-sm text-[#E07B39] font-medium mt-3">
              Discussing Case: <span className="font-mono">{caseId}</span>
            </p>
          )}
        </div>

        {/* Chat Window */}
        <div className="h-[600px] md:h-[700px]">
          <ChatWindow caseId={caseId || undefined} />
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 text-blue-700 text-sm">
          <p className="font-semibold mb-1">⚖️ Legal Disclaimer</p>
          <p>
            This AI assistant provides legal information, not legal advice.
            Always consult a licensed advocate for your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center animate-pulse space-y-2">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>

        <div className="h-[600px] md:h-[700px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoadingSkeleton />}>
      <ChatPageContent />
    </Suspense>
  );
}
