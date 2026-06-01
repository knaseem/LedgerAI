'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Activity, Sparkles } from 'lucide-react';
import ChatDrawer from './ChatDrawer';

const pathLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/ap': 'Accounts Payable',
  '/dashboard/reconciliation': 'Bank Reconciliation',
  '/dashboard/close': 'Financial Close',
  '/dashboard/audit': 'Audit Log',
  '/dashboard/workflows/new': 'Workflow Builder',
  '/dashboard/intelligence': 'Spend Intelligence',
  '/dashboard/ar': 'Accounts Receivable',
};

export default function Topbar() {
  const pathname = usePathname();
  const currentLabel = pathLabels[pathname] || 'Dashboard';
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-3" style={{ borderRadius: '0 0 16px 16px', marginLeft: '260px' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted font-medium">LedgerAI</span>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted opacity-50" />
          <span className="text-text-primary font-semibold">{currentLabel}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Ask AI Button */}
          <button 
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Ask LedgerAI</span>
          </button>

          {/* Active Workflows */}
          <div className="flex items-center gap-2 px-3 py-1.5 glass-flat hidden md:flex">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-text-secondary">4 Active Workflows</span>
          </div>

          {/* Status Badge */}
          <div className="pill pill-success hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Operational
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors">
            <Bell className="w-4.5 h-4.5 text-text-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-violet flex items-center justify-center text-xs font-bold text-white">
            KN
          </div>
        </div>
      </header>
      
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
