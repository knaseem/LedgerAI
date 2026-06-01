'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Calendar,
  Building2,
  Play,
  Loader2,
  Eye,
  Filter,
} from 'lucide-react';
import {
  bankTransactions,
  ledgerEntries,
  type BankTransaction,
  type LedgerEntry,
} from '@/lib/mockData';
import { useReconciliationStore } from '@/lib/store';

// ── Transaction Row ──────────────────────────────────────────────
function TxnRow({
  label,
  date,
  description,
  amount,
  type,
  reference,
  matchStatus,
  delay,
}: {
  label: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  reference: string;
  matchStatus: 'matched' | 'unmatched' | 'partial';
  delay: number;
}) {
  const borderColor =
    matchStatus === 'matched' ? 'border-l-success' :
    matchStatus === 'unmatched' ? 'border-l-error' : 'border-l-warning';

  return (
    <motion.div
      className={`glass-flat glass-flat-hover p-3.5 border-l-2 ${borderColor}`}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{description}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-text-muted font-mono">{reference}</span>
            <span className="text-[10px] text-text-muted">{date}</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-mono font-semibold ${type === 'credit' ? 'text-success' : 'text-text-primary'}`}>
            {type === 'credit' ? '+' : '-'}${amount.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Mismatch Detail ──────────────────────────────────────────────
function MismatchModal({
  bankTxn,
  reasoning,
  onClose,
}: {
  bankTxn: BankTransaction;
  reasoning: string;
  onClose: () => void;
}) {
  const resolveMismatch = useReconciliationStore(s => s.resolveMismatch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="glass relative w-full max-w-lg p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Unmatched Transaction
        </h3>
        <div className="glass-flat p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-text-muted text-xs">Description</p><p className="font-medium">{bankTxn.description}</p></div>
            <div><p className="text-text-muted text-xs">Amount</p><p className="font-mono font-medium">${bankTxn.amount.toLocaleString()}</p></div>
            <div><p className="text-text-muted text-xs">Reference</p><p className="font-mono">{bankTxn.reference}</p></div>
            <div><p className="text-text-muted text-xs">Date</p><p>{bankTxn.date}</p></div>
          </div>
        </div>
        <div className="glass-flat p-4 border-l-2 border-accent mb-4">
          <p className="text-[10px] uppercase tracking-wider text-accent mb-1">LedgerAI Analysis</p>
          <p className="text-sm text-text-secondary">{reasoning}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { resolveMismatch(bankTxn.id); onClose(); }} 
            className="btn-primary flex-1 bg-warning hover:bg-warning/80"
          >
            Force Match to Ledger
          </button>
          <button 
            onClick={() => { resolveMismatch(bankTxn.id); onClose(); }} 
            className="btn-primary flex-1"
          >
            Create Adjusting Entry
          </button>
        </div>
        <button onClick={onClose} className="btn-ghost w-full mt-3">Cancel</button>
      </motion.div>
    </div>
  );
}

// ── Reconciliation Page ──────────────────────────────────────────
export default function ReconciliationPage() {
  const { matches, isReconciling, setReconciling } = useReconciliationStore();
  const [selectedMismatch, setSelectedMismatch] = useState<{bankTxn: BankTransaction; reasoning: string} | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');

  const matchedCount = matches.filter((m) => m.status === 'matched').length;
  const unmatchedCount = matches.filter((m) => m.status === 'unmatched').length;
  const accuracy = ((matchedCount / matches.length) * 100).toFixed(1);

  const getMatchStatus = (id: string, type: 'bank' | 'ledger') => {
    const match = matches.find((m) =>
      type === 'bank' ? m.bankId === id : m.ledgerId === id
    );
    return match?.status || 'partial';
  };

  const handleRunReconciliation = () => {
    setReconciling(true);
    setTimeout(() => setReconciling(false), 3000);
  };

  const filteredBank = bankTransactions.filter((t) => {
    if (accountFilter !== 'all' && t.account !== accountFilter) return false;
    if (dateFilter && !t.date.includes(dateFilter)) return false;
    return true;
  });

  const filteredLedger = ledgerEntries.filter((e) => {
    if (dateFilter && !e.date.includes(dateFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
          <p className="text-sm text-text-muted mt-1">Match bank transactions against ledger entries.</p>
        </div>
        <button
          onClick={handleRunReconciliation}
          disabled={isReconciling}
          className="btn-primary"
        >
          {isReconciling ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Running...</>
          ) : (
            <><Play className="w-4 h-4" />Run Reconciliation</>
          )}
        </button>
      </div>

      {/* Summary Bar */}
      <div className="glass p-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm"><span className="font-bold text-success">{matchedCount}</span> <span className="text-text-muted">Matched</span></span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-error" />
            <span className="text-sm"><span className="font-bold text-error">{unmatchedCount}</span> <span className="text-text-muted">Unmatched</span></span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-accent" />
            <span className="text-sm"><span className="font-bold text-accent">{accuracy}%</span> <span className="text-text-muted">Accuracy</span></span>
          </div>
        </div>
        {isReconciling && (
          <div className="pill pill-info">
            <Loader2 className="w-3 h-3 animate-spin" />
            Reconciling...
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Filter by date (YYYY-MM)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 glass-flat text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-text-muted" />
          {['all', 'Operating', 'Revenue', 'Payroll'].map((a) => (
            <button
              key={a}
              onClick={() => setAccountFilter(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                accountFilter === a ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {a === 'all' ? 'All Accounts' : a}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Transactions */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent" />
            Bank Transactions
            <span className="pill pill-neutral ml-2">{filteredBank.length}</span>
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredBank.map((txn, i) => {
              const status = getMatchStatus(txn.id, 'bank');
              const isUnmatched = status === 'unmatched';
              return (
                <div key={txn.id} className="relative">
                  <TxnRow
                    label={txn.id}
                    date={txn.date}
                    description={txn.description}
                    amount={txn.amount}
                    type={txn.type}
                    reference={txn.reference}
                    matchStatus={status}
                    delay={i * 0.02}
                  />
                  {isUnmatched && (
                    <button
                      onClick={() => {
                        const match = matches.find((m) => m.bankId === txn.id);
                        setSelectedMismatch({
                          bankTxn: txn,
                          reasoning: match?.reasoning || 'No reasoning available.',
                        });
                      }}
                      className="absolute top-2 right-2 btn-ghost btn-sm text-warning border-warning/30"
                    >
                      <Eye className="w-3 h-3" />
                      View Mismatch
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ledger Entries */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-violet" />
            Ledger Entries
            <span className="pill pill-neutral ml-2">{filteredLedger.length}</span>
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredLedger.map((entry, i) => {
              const status = getMatchStatus(entry.id, 'ledger');
              return (
                <TxnRow
                  key={entry.id}
                  label={entry.id}
                  date={entry.date}
                  description={entry.description}
                  amount={entry.amount}
                  type={entry.type}
                  reference={entry.reference}
                  matchStatus={status}
                  delay={i * 0.02}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Mismatch Modal */}
      {selectedMismatch && (
        <MismatchModal
          bankTxn={selectedMismatch.bankTxn}
          reasoning={selectedMismatch.reasoning}
          onClose={() => setSelectedMismatch(null)}
        />
      )}
    </div>
  );
}
