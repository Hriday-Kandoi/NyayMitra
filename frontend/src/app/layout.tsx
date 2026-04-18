import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayMitra - Legal Intelligence for Indian Citizens",
  description:
    "AI-powered legal platform providing case analysis and legal guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#EEF1F8] text-[#1A2744]">{children}</body>
    </html>
  );
}
