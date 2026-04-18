"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChatWindow } from "@/components/ai/ChatWindow";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle, FileText, MessageSquare, ArrowLeft } from "lucide-react";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const cnr = searchParams.get("cnr");

  return (
    <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/case" className="inline-block">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              Back to Cases
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-2">
              AI Legal Advisor
            </h1>
            <p className="text-lg text-[#6B7A9A]">
              Get instant, personalized legal insights powered by advanced AI
            </p>
          </div>
        </div>

        {/* Main Chat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Case Context Sidebar */}
          {cnr && (
            <Card hoverable className="lg:col-span-1 h-fit">
              <CardHeader className="bg-[#1A2744]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={20} />
                  Case Context
                </h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                    CNR Number
                  </p>
                  <p className="font-mono text-sm text-[#1A2744] break-all">{cnr}</p>
                </div>
                <div className="border-t border-[#D4D8E4] pt-4">
                  <p className="text-xs text-[#6B7A9A] mb-3">
                    Ask the AI about your case details, hearing dates, legal options, and next steps.
                  </p>
                </div>
                <Link href="/case" className="w-full">
                  <Button variant="outline" size="sm" fullWidth>
                    View Case Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Chat Window */}
          <Card hoverable className={cnr ? "lg:col-span-3" : "lg:col-span-4"}>
            <CardHeader className="bg-[#1A2744]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={20} />
                Chat with AI
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] md:h-[600px]">
                <ChatWindow caseId={cnr || undefined} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <Card className="border-l-4 border-[#E07B39]">
          <CardContent className="pt-6 flex gap-4">
            <AlertCircle size={20} className="text-[#E07B39] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#1A2744] mb-2">Legal Disclaimer</h3>
              <p className="text-[#6B7A9A] text-sm leading-relaxed">
                This AI assistant provides general legal information and analysis based on Indian law.
                It is <span className="font-semibold">NOT a substitute for professional legal advice</span>.
                Always consult a licensed advocate, lawyer, or legal professional for advice specific to
                your situation. NyayMitra and its AI cannot be held liable for any decisions made based on
                this information.
              </p>
            </div>
          </CardContent>
        </Card>
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
