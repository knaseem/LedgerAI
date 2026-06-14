'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Activity, Sparkles, ChevronDown, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatDrawer from './ChatDrawer';
import { useSessionStore } from '@/lib/store';
import { mockTeam, roleColors, roleLabels } from '@/lib/rbac';

const pathLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/ap': 'Accounts Payable',
  '/dashboard/reconciliation': 'Bank Reconciliation',
  '/dashboard/close': 'Financial Close',
  '/dashboard/audit': 'Audit Log',
  '/dashboard/workflows/new': 'Workflow Builder',
  '/dashboard/intelligence': 'Spend Intelligence',
  '/dashboard/ar': 'Accounts Receivable',
  '/dashboard/compliance': 'Compliance & Security',
  '/dashboard/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const currentLabel = pathLabels[pathname] || 'Dashboard';
  const [chatOpen, setChatOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { currentUser, setCurrentUser } = useSessionStore();
  const rc = roleColors[currentUser.role];

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

          {/* Avatar / Role Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-surface-hover transition-colors border border-border/40 bg-surface/30 shadow-sm"
            >
              <div className={`w-7 h-7 rounded-lg ${rc.bg} flex items-center justify-center text-xs font-bold ${rc.text} shadow-inner`}>
                {currentUser.avatar}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[9px] text-text-muted font-medium uppercase tracking-wider leading-none">Simulating</p>
                <p className="text-xs font-semibold text-text-primary mt-0.5">{currentUser.name}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted opacity-70" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 glass p-2 space-y-1 z-50 shadow-2xl border border-border/80"
                    style={{ borderRadius: '14px' }}
                  >
                    <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold px-3 py-2 border-b border-border/30 mb-1">
                      Switch Role Simulator
                    </p>
                    <div className="max-h-[300px] overflow-y-auto pr-1 space-y-0.5 scrollbar-thin">
                      {mockTeam.map((member) => {
                        const mRc = roleColors[member.role];
                        const isSelected = member.id === currentUser.id;
                        return (
                          <button
                            key={member.id}
                            onClick={() => {
                              setCurrentUser(member);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-xs transition-all hover:bg-surface-hover ${
                              isSelected ? 'bg-accent/10 border border-accent/20' : 'border border-transparent'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg ${mRc.bg} flex items-center justify-center text-xs font-bold ${mRc.text} flex-shrink-0`}>
                              {member.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-text-primary truncate">{member.name}</p>
                              <p className="text-[10px] text-text-muted truncate">
                                {roleLabels[member.role]} · {member.department}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

