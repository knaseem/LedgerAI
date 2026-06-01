import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LedgerAI — Autonomous Finance Workers for Teams That Scale",
  description:
    "LedgerAI automates 85% of finance workflows. Browser agents handle Accounts Payable, Bank Reconciliation, and Financial Close — exactly like your best team members.",
  keywords: "finance automation, AI, accounts payable, bank reconciliation, financial close, audit",
  openGraph: {
    title: "LedgerAI — Autonomous Finance Workers",
    description: "Automate 85% of Finance Workflows Without APIs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
