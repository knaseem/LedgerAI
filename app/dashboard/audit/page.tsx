'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import type { AuditEntry } from '@/lib/mockData';

// ── Result Icon ──────────────────────────────────────────────────
function ResultIcon({ result }: { result: AuditEntry['result'] }) {
  switch (result) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-error" />;
  }
}

const resultPill: Record<string, string> = {
  success: 'pill-success',
  warning: 'pill-warning',
  error: 'pill-error',
};

// ── Expandable Row ───────────────────────────────────────────────
function AuditRow({ entry, delay }: { entry: AuditEntry; delay: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="glass-flat overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-surface-hover transition-colors text-left"
      >
        <div className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        </div>

        <span className="text-xs text-text-muted font-mono w-[140px] flex-shrink-0">
          {entry.timestamp}
        </span>

        <div className="flex items-center gap-2 w-[120px] flex-shrink-0">
          <ResultIcon result={entry.result} />
          <span className="text-xs font-medium text-text-secondary">{entry.agent}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary truncate">{entry.action}</p>
        </div>

        <span className="text-xs text-text-muted font-mono w-[80px] text-right flex-shrink-0">
          {entry.system}
        </span>

        <div className={`pill ${resultPill[entry.result]} flex-shrink-0`}>
          {entry.result.charAt(0).toUpperCase() + entry.result.slice(1)}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="px-5 py-4 ml-8">
              <div className="glass-flat p-4 border-l-2 border-accent">
                <p className="text-[10px] uppercase tracking-wider text-accent mb-2">Full Reasoning Trace</p>
                <p className="text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                  {entry.reasoning}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                <span>Workflow: <span className="text-text-secondary">{entry.workflow}</span></span>
                <span>System: <span className="text-text-secondary font-mono">{entry.system}</span></span>
                <span>ID: <span className="text-text-secondary font-mono">{entry.id}</span></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Audit Log Page ───────────────────────────────────────────────
export default function AuditLogPage() {
  const entries = useAuditStore((s) => s.entries);
  const [search, setSearch] = useState('');
  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(20);

  const workflows = ['all', ...Array.from(new Set(entries.map((e) => e.workflow)))];

  const filtered = entries.filter((entry) => {
    if (workflowFilter !== 'all' && entry.workflow !== workflowFilter) return false;
    if (resultFilter !== 'all' && entry.result !== resultFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        entry.action.toLowerCase().includes(q) ||
        entry.agent.toLowerCase().includes(q) ||
        entry.system.toLowerCase().includes(q) ||
        entry.reasoning.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const visible = filtered.slice(0, visibleCount);

  const handleExport = () => {
    const text = filtered
      .map((e) => `[${e.timestamp}] ${e.agent} | ${e.action} | ${e.system} | ${e.result}\n  Reasoning: ${e.reasoning}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledgerai-audit-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-sm text-text-muted mt-1">Complete audit trail with AI reasoning traces.</p>
        </div>
        <button onClick={handleExport} className="btn-ghost">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Entries', value: entries.length, color: 'text-text-primary' },
          { label: 'Success Rate', value: `${((entries.filter(e => e.result === 'success').length / entries.length) * 100).toFixed(1)}%`, color: 'text-success' },
          { label: 'Exceptions', value: entries.filter(e => e.result !== 'success').length, color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="glass-flat p-4 text-center">
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit log..."
            className="w-full pl-10 pr-4 py-2.5 glass-flat text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select
            value={workflowFilter}
            onChange={(e) => setWorkflowFilter(e.target.value)}
            className="px-3 py-2 glass-flat text-xs bg-transparent text-text-primary focus:outline-none cursor-pointer"
          >
            {workflows.map((w) => (
              <option key={w} value={w} className="bg-background text-text-primary">
                {w === 'all' ? 'All Workflows' : w}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {['all', 'success', 'warning', 'error'].map((r) => (
            <button
              key={r}
              onClick={() => setResultFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                resultFilter === r ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {r === 'all' ? 'All Results' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
           <button
             onClick={() => setSearch('fraud')}
             className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-warning/30 text-warning hover:bg-warning/10"
           >
             Fraud Checks
           </button>
           <button
             onClick={() => setSearch('tax')}
             className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-info/30 text-info hover:bg-info/10"
           >
             Tax Compliance
           </button>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="space-y-1.5">
        {/* Header */}
        <div className="px-5 py-2 flex items-center gap-4 text-[10px] uppercase tracking-wider text-text-muted">
          <div className="w-3.5" />
          <span className="w-[140px] flex-shrink-0">Timestamp</span>
          <span className="w-[120px] flex-shrink-0">Agent</span>
          <span className="flex-1">Action</span>
          <span className="w-[80px] text-right flex-shrink-0">System</span>
          <span className="w-[80px] flex-shrink-0">Result</span>
        </div>

        {visible.map((entry, i) => (
          <AuditRow key={entry.id} entry={entry} delay={i * 0.02} />
        ))}

        {visibleCount < filtered.length && (
          <button
            onClick={() => setVisibleCount((v) => v + 20)}
            className="btn-ghost w-full mt-4"
          >
            <ChevronDown className="w-4 h-4" />
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  );
}
