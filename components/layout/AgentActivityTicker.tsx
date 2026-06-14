'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  ArrowLeftRight,
  ShieldCheck,
  TrendingUp,
  Bot,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AgentEvent {
  id: string;
  timestamp: string;
  agent: string;
  agentType: 'ap' | 'recon' | 'close' | 'compliance' | 'intelligence';
  message: string;
  status: 'running' | 'success' | 'warning';
  detail?: string;
}

const agentIcons: Record<AgentEvent['agentType'], React.ElementType> = {
  ap: FileText,
  recon: ArrowLeftRight,
  close: TrendingUp,
  compliance: ShieldCheck,
  intelligence: Bot,
};

const agentColors: Record<AgentEvent['agentType'], string> = {
  ap: 'text-accent',
  recon: 'text-violet',
  close: 'text-info',
  compliance: 'text-success',
  intelligence: 'text-warning',
};

const agentBgs: Record<AgentEvent['agentType'], string> = {
  ap: 'bg-accent/10',
  recon: 'bg-violet/10',
  close: 'bg-info/10',
  compliance: 'bg-success/10',
  intelligence: 'bg-warning/10',
};

// Pool of realistic agent events
const eventPool: Omit<AgentEvent, 'id' | 'timestamp'>[] = [
  { agent: 'Invoice-Agent', agentType: 'ap', message: 'Extracting fields from INV-2026-042...', status: 'running', detail: 'OCR confidence: 97.1%' },
  { agent: 'Invoice-Agent', agentType: 'ap', message: 'Three-way match completed for INV-2026-038', status: 'success', detail: '$23,400 — zero variance' },
  { agent: 'Invoice-Agent', agentType: 'ap', message: 'Auto-approved INV-2026-039 — routed to payment queue', status: 'success', detail: 'PO-4431 matched' },
  { agent: 'Invoice-Agent', agentType: 'ap', message: 'Exception flagged on INV-2026-044 — amount mismatch', status: 'warning', detail: 'Variance: $2,100 (8.4%)' },
  { agent: 'Match-Agent', agentType: 'ap', message: 'Processing vendor batch: Datadog, MongoDB, Cloudflare', status: 'running', detail: '3 invoices in queue' },
  { agent: 'Match-Agent', agentType: 'ap', message: 'Duplicate detection scan completed', status: 'success', detail: '0 duplicates found in batch' },
  { agent: 'Recon-Agent', agentType: 'recon', message: 'Matching bank feed BNK-045 to ledger...', status: 'running', detail: 'Chase Business Checking' },
  { agent: 'Recon-Agent', agentType: 'recon', message: 'Auto-matched 14 transactions this hour', status: 'success', detail: '99.2% match rate' },
  { agent: 'Recon-Agent', agentType: 'recon', message: 'Flagged unidentified wire transfer $8,200', status: 'warning', detail: 'No PO or vendor match found' },
  { agent: 'Recon-Agent', agentType: 'recon', message: 'Multi-currency reconciliation — EUR account balanced', status: 'success', detail: '12 transactions matched' },
  { agent: 'Close-Agent', agentType: 'close', message: 'Generating depreciation entries for 156 assets...', status: 'running', detail: 'Straight-line + declining balance' },
  { agent: 'Close-Agent', agentType: 'close', message: 'Intercompany elimination completed — $4.2M', status: 'success', detail: '5 entities reconciled' },
  { agent: 'Close-Agent', agentType: 'close', message: 'Revenue recognition analysis — 3 contracts deferred', status: 'success', detail: 'ASC 606 compliance verified' },
  { agent: 'Close-Agent', agentType: 'close', message: 'Budget variance detected: Marketing -8%', status: 'warning', detail: '$120K under budget — investigating' },
  { agent: 'Compliance-Agent', agentType: 'compliance', message: 'SOX control test passed — dual approval workflow', status: 'success', detail: 'CC6.1 — Access Controls' },
  { agent: 'Compliance-Agent', agentType: 'compliance', message: 'Running GAAP compliance checklist...', status: 'running', detail: '92% complete — 2 items remaining' },
  { agent: 'Compliance-Agent', agentType: 'compliance', message: 'Policy update detected — expense thresholds changed', status: 'warning', detail: 'Auto-updating matching rules' },
  { agent: 'Spend-Agent', agentType: 'intelligence', message: 'SaaS utilization scan — Adobe at 45% usage', status: 'warning', detail: 'Potential savings: $2,310/mo' },
  { agent: 'Spend-Agent', agentType: 'intelligence', message: 'Vendor pricing benchmark completed', status: 'success', detail: '2 negotiation opportunities found' },
  { agent: 'Spend-Agent', agentType: 'intelligence', message: 'Cash flow forecast updated — 13-week projection', status: 'success', detail: 'Runway: 18 months at current burn' },
];

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AgentActivityTicker({ compact = false }: { compact?: boolean }) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [expanded, setExpanded] = useState(!compact);
  const feedRef = useRef<HTMLDivElement>(null);
  const eventIndexRef = useRef(0);

  useEffect(() => {
    // Seed initial events
    const initial: AgentEvent[] = [];
    const shuffled = [...eventPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5; i++) {
      const evt = shuffled[i];
      initial.push({
        ...evt,
        id: `evt-init-${i}`,
        timestamp: formatTime(),
        status: evt.status === 'running' ? 'success' : evt.status,
      });
    }
    setEvents(initial.reverse());

    // Add new events periodically
    const interval = setInterval(() => {
      const idx = eventIndexRef.current % eventPool.length;
      eventIndexRef.current++;
      const evt = eventPool[idx];
      
      const newEvent: AgentEvent = {
        ...evt,
        id: `evt-${Date.now()}-${Math.random()}`,
        timestamp: formatTime(),
      };

      setEvents((prev) => {
        const updated = [newEvent, ...prev];
        return updated.slice(0, 20); // Keep max 20 events
      });

      // Auto-resolve 'running' events after a delay
      if (newEvent.status === 'running') {
        setTimeout(() => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === newEvent.id
                ? { ...e, status: 'success', message: e.message.replace('...', ' ✓ Done') }
                : e
            )
          );
        }, 2000 + Math.random() * 2000);
      }
    }, 3500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current && expanded) {
      feedRef.current.scrollTop = 0;
    }
  }, [events, expanded]);

  const displayEvents = expanded ? events : events.slice(0, 3);

  return (
    <motion.div
      className="glass overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="w-4 h-4 text-accent" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">Live Agent Activity</h3>
          <div className="pill pill-success text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Event Feed */}
      <div
        ref={feedRef}
        className={`overflow-y-auto transition-all duration-300 ${
          expanded ? 'max-h-[320px]' : 'max-h-[140px]'
        }`}
      >
        <AnimatePresence initial={false}>
          {displayEvents.map((event) => {
            const AgentIcon = agentIcons[event.agentType];
            const color = agentColors[event.agentType];
            const bg = agentBgs[event.agentType];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 py-2.5 border-t border-border/30 flex items-center gap-3 hover:bg-surface-hover/50 transition-colors"
              >
                {/* Agent Icon */}
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <AgentIcon className={`w-3.5 h-3.5 ${color}`} />
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {event.status === 'running' ? (
                    <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                  ) : event.status === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                  )}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${
                    event.status === 'running' ? 'text-accent' : 'text-text-primary'
                  }`}>
                    <span className="font-medium text-text-muted">{event.agent}</span>
                    {' · '}
                    {event.message}
                  </p>
                  {event.detail && (
                    <p className="text-[10px] text-text-muted mt-0.5 truncate">{event.detail}</p>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-text-muted font-mono flex-shrink-0 tabular-nums">
                  {event.timestamp}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
