"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  FileText,
  Calendar,
  MessageSquare,
  Search,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  // Mock user data
  const userName = "Rajesh Kumar";
  const totalCases = 3;
  const nextHearing = "April 25, 2026";
  const daysUntilHearing = 6;
  const unreadMessages = 2;

  // Mock stats
  const stats = [
    {
      icon: FileText,
      label: "Total Cases",
      value: totalCases,
      color: "#E07B39",
      bgColor: "#FFF0E8",
    },
    {
      icon: Clock,
      label: "Next Hearing",
      value: `${daysUntilHearing}d away`,
      color: "#1A2744",
      bgColor: "#EEF1F8",
      subtext: nextHearing,
    },
    {
      icon: MessageSquare,
      label: "Messages",
      value: unreadMessages,
      color: "#6B7A9A",
      bgColor: "#EEF1F8",
      subtext: "Unread",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Search,
      title: "Search Cases",
      description: "Find and track your court cases",
      href: "/case",
    },
    {
      icon: MessageSquare,
      title: "AI Advisor",
      description: "Ask legal questions to our AI",
      href: "/chat",
    },
    {
      icon: FileText,
      title: "Documents",
      description: "Manage and analyze documents",
      href: "/documents",
    },
    {
      icon: AlertCircle,
      title: "Help & Support",
      description: "Get answers to common questions",
      href: "#",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      type: "case_update",
      title: "Hearing Scheduled",
      description: "Case AP27K123456789012345 has a hearing on April 25, 2026",
      timestamp: "2 days ago",
      icon: Calendar,
    },
    {
      type: "message",
      title: "New Message",
      description: "Your AI advisor has responded to your legal query",
      timestamp: "1 day ago",
      icon: MessageSquare,
    },
    {
      type: "document",
      title: "Document Added",
      description: "Order document uploaded for your case",
      timestamp: "3 days ago",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A2744]">
            Namaste, {userName} 👋
          </h1>
          <p className="text-lg text-[#6B7A9A]">
            Here's an overview of your legal matters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Card key={idx} hoverable>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <IconComponent
                        size={24}
                        style={{ color: stat.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#6B7A9A] mb-1">
                        {stat.label}
                      </p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      {stat.subtext && (
                        <p className="text-xs text-[#6B7A9A] mt-2">{stat.subtext}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A2744]">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <Link key={idx} href={action.href} className="h-full">
                  <Card hoverable className="h-full">
                    <CardContent className="pt-6 h-full flex flex-col">
                      <div className="space-y-3 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-[#EEF1F8] flex items-center justify-center hover:bg-[#E07B39] transition-colors">
                          <IconComponent
                            size={24}
                            className="text-[#E07B39] hover:text-white transition-colors"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A2744] mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-[#6B7A9A]">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1A2744]">Recent Activity</h2>
            <Link href="#">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => {
              const IconComponent = activity.icon;
              return (
                <Card key={idx} hoverable>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EEF1F8] flex items-center justify-center flex-shrink-0">
                        <IconComponent
                          size={20}
                          className="text-[#E07B39]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-[#1A2744] mb-1">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-[#6B7A9A]">
                              {activity.description}
                            </p>
                          </div>
                          <p className="text-xs text-[#6B7A9A] whitespace-nowrap">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-l-4 border-[#E07B39]">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1A2744] mb-2">
                  Need Legal Help?
                </h3>
                <p className="text-[#6B7A9A] max-w-2xl mx-auto">
                  Our AI advisor is available 24/7 to answer your legal questions and provide insights on your cases.
                </p>
              </div>
              <Link href="/chat">
                <Button size="lg">
                  Start Chatting with AI
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
