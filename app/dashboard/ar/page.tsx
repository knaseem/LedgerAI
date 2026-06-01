'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { useARStore } from '@/lib/store';
import { arInvoices } from '@/lib/mockData';

// ── AR Aging Summary ─────────────────────────────────────────────
function ARAgingSummary() {
  const current = arInvoices.filter(i => i.daysOverdue === 0).reduce((a, b) => a + b.amount, 0);
  const days30 = arInvoices.filter(i => i.daysOverdue > 0 && i.daysOverdue <= 30).reduce((a, b) => a + b.amount, 0);
  const days60 = arInvoices.filter(i => i.daysOverdue > 30 && i.daysOverdue <= 60).reduce((a, b) => a + b.amount, 0);
  const days90 = arInvoices.filter(i => i.daysOverdue > 60).reduce((a, b) => a + b.amount, 0);

  const total = current + days30 + days60 + days90;

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 text-accent" />
        AR Aging Summary
      </h3>
      
      <div className="flex gap-2 h-12 rounded-lg overflow-hidden mb-4">
        <div style={{ width: `${(current/total)*100}%` }} className="bg-success h-full transition-all" />
        <div style={{ width: `${(days30/total)*100}%` }} className="bg-info h-full transition-all" />
        <div style={{ width: `${(days60/total)*100}%` }} className="bg-warning h-full transition-all" />
        <div style={{ width: `${(days90/total)*100}%` }} className="bg-error h-full transition-all" />
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs text-text-muted">Current</p>
          <p className="text-sm font-bold mt-1 text-success">${current.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">1-30 Days</p>
          <p className="text-sm font-bold mt-1 text-info">${days30.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">31-60 Days</p>
          <p className="text-sm font-bold mt-1 text-warning">${days60.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">61+ Days</p>
          <p className="text-sm font-bold mt-1 text-error">${days90.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// ── Automated Dunning Queue ──────────────────────────────────────
function DunningQueue() {
  const dunningQueue = useARStore(s => s.dunningQueue);
  const approveDunning = useARStore(s => s.approveDunning);
  const updateDunningEmail = useARStore(s => s.updateDunningEmail);
  const [editingId, setEditingId] = useState<string | null>(null);

  const pending = dunningQueue.filter(q => q.status === 'pending_approval');

  if (pending.length === 0) {
    return (
      <div className="glass p-6 h-full flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-10 h-10 text-success/50 mb-3" />
        <h3 className="text-sm font-semibold text-text-primary">Dunning Queue Clear</h3>
        <p className="text-xs text-text-muted mt-1">All automated collection emails have been processed.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Send className="w-4 h-4 text-accent" />
          Automated Dunning Queue
        </h3>
        <span className="pill pill-warning">{pending.length} Pending Approval</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence>
          {pending.map((item, i) => {
            const isEditing = editingId === item.id;
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="glass-flat p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold">{item.customer}</p>
                    <p className="text-xs text-text-muted font-mono mt-0.5">
                      Invoice: {item.invoiceId} · <span className="text-error">{item.daysOverdue} days overdue</span>
                    </p>
                  </div>
                  <p className="text-sm font-bold font-mono text-text-primary">${item.amount.toLocaleString()}</p>
                </div>

                {isEditing ? (
                  <textarea
                    className="w-full bg-surface p-3 rounded-lg border border-accent/50 text-xs text-text-secondary font-mono leading-relaxed mb-4 focus:outline-none focus:ring-1 focus:ring-accent min-h-[120px]"
                    value={item.draftedEmail}
                    onChange={(e) => updateDunningEmail(item.id, e.target.value)}
                  />
                ) : (
                  <div className="bg-surface p-3 rounded-lg border border-border/50 text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed mb-4">
                    {item.draftedEmail}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (isEditing) setEditingId(null);
                      approveDunning(item.id);
                    }}
                    className="btn-primary btn-sm flex-1"
                  >
                    <Send className="w-3 h-3" />
                    Approve & Send
                  </button>
                  <button 
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                    className="btn-ghost btn-sm"
                  >
                    {isEditing ? 'Save Draft' : 'Edit Draft'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function AccountsReceivablePage() {
  const invoices = useARStore(s => s.invoices);
  const [sortField, setSortField] = useState<'amount' | 'dueDate' | 'daysOverdue'>('daysOverdue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = [...invoices].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'amount') return (a.amount - b.amount) * dir;
    if (sortField === 'daysOverdue') return (a.daysOverdue - b.daysOverdue) * dir;
    return a.dueDate.localeCompare(b.dueDate) * dir;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounts Receivable</h1>
        <p className="text-sm text-text-muted mt-1">Manage outstanding invoices, credit risk, and automated collections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Left Col: Aging + Invoices */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ARAgingSummary />
          
          <div className="glass flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Open AR Invoices
              </h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Customer</th>
                    <th className="cursor-pointer" onClick={() => toggleSort('amount')}>
                      <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="cursor-pointer" onClick={() => toggleSort('daysOverdue')}>
                      <span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th>Credit Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv, i) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td className="font-mono text-xs">{inv.id}</td>
                      <td className="font-medium">{inv.customer}</td>
                      <td className="font-mono">${inv.amount.toLocaleString()}</td>
                      <td>
                        {inv.daysOverdue > 0 ? (
                          <span className="text-error font-medium text-xs">{inv.daysOverdue} days late</span>
                        ) : (
                          <span className="text-success font-medium text-xs">Current</span>
                        )}
                      </td>
                      <td>
                        <div className={`pill ${
                          inv.riskScore === 'high' ? 'pill-error' : 
                          inv.riskScore === 'medium' ? 'pill-warning' : 'pill-success'
                        }`}>
                          {inv.riskScore === 'high' && <ShieldAlert className="w-3 h-3" />}
                          {inv.riskScore.charAt(0).toUpperCase() + inv.riskScore.slice(1)} Risk
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Dunning Queue */}
        <div>
          <DunningQueue />
        </div>
      </div>
    </div>
  );
}
