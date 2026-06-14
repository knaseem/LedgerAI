'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Lock, Fingerprint, Copy, Check } from 'lucide-react';
import { useInvoiceStore, useSessionStore } from '@/lib/store';
import { Invoice } from '@/lib/mockData';
import { roleLabels, roleColors } from '@/lib/rbac';
import { canUserSign, ApprovalStep } from '@/lib/approvalEngine';

interface ApprovalTimelineProps {
  invoice: Invoice;
}

export default function ApprovalTimeline({ invoice }: ApprovalTimelineProps) {
  const { currentUser } = useSessionStore();
  const signInvoice = useInvoiceStore((s) => s.signInvoice);
  const [comment, setComment] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = invoice.approvalRoute || [];
  const signatures = invoice.signatures || [];
  
  // Find which user IDs have signed
  const alreadySignedUserIds = signatures.map((s) => s.userId);
  
  // Check user signing eligibility for the next step
  const signCheck = canUserSign(
    currentUser,
    invoice.uploaderId || 'USR-001',
    invoice.amount,
    steps,
    alreadySignedUserIds
  );

  const nextPendingIndex = steps.findIndex((s) => s.status === 'pending');

  const handleSign = () => {
    signInvoice(invoice.id, currentUser, comment);
    setComment('');
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (steps.length === 0) {
    return (
      <div className="glass-flat p-4 text-center">
        <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
        <p className="text-xs font-semibold text-success">Auto-Approved</p>
        <p className="text-[10px] text-text-muted mt-1">Amount is under $1,000 threshold and required no manual approvals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
        <Fingerprint className="w-3.5 h-3.5 text-accent" />
        Digital Signature Audit Trail
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/40">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isActive = index === nextPendingIndex;
          const rc = roleColors[step.role];
          const signature = step.signature;

          return (
            <div key={index} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                  isCompleted
                    ? 'bg-success border-success text-white'
                    : isActive
                    ? 'bg-accent/10 border-accent text-accent animate-pulse shadow-[0_0_12px_rgba(var(--color-accent-rgb),0.3)]'
                    : 'bg-background border-border text-text-muted'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-text-muted/40'}`} />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-surface/30 border-border/40'
                    : isActive
                    ? 'bg-accent/5 border-accent/30 shadow-md'
                    : 'bg-surface/10 border-border/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`pill ${rc.pill} text-[9px]`}>
                    Required: {roleLabels[step.role]}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium">
                    Step {index + 1} of {steps.length}
                  </span>
                </div>

                {isCompleted && signature ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-primary">
                      {signature.userName}{' '}
                      <span className="text-[10px] text-text-muted font-normal">
                        ({roleLabels[signature.role]})
                      </span>
                    </p>
                    {signature.comment && (
                      <p className="text-xs text-text-secondary bg-surface/50 border border-border/30 p-2 rounded-lg italic">
                        "{signature.comment}"
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-text-muted font-mono">
                      <span>IP: {signature.ip}</span>
                      <span>·</span>
                      <span>{signature.timestamp}</span>
                    </div>
                    {/* Crypto Signature String */}
                    <div className="flex items-center gap-1.5 text-[9px] bg-background border border-border/40 p-1.5 px-2.5 rounded-lg text-text-muted font-mono justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-success" />
                        Signed: {signature.hash.slice(0, 16)}…
                      </span>
                      <button
                        onClick={() => copyToClipboard(signature.hash, index)}
                        className="p-1 hover:text-text-primary transition-colors hover:bg-surface rounded"
                        title="Copy digital signature hash"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-text-secondary">
                      Awaiting approval
                    </p>
                    
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        {signCheck.canSign ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Add approval comment (optional)..."
                              className="w-full px-3 py-2 text-xs glass-flat bg-transparent border border-border/50 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40"
                            />
                            <button
                              onClick={handleSign}
                              className="w-full btn-primary btn-sm flex items-center justify-center gap-1.5 py-2 font-semibold text-xs"
                            >
                              <Lock className="w-3 h-3" />
                              Digitally Sign & Approve
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 p-2.5 rounded-lg bg-warning/5 border border-warning/20 text-warning text-[10px] leading-relaxed">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>
                              {signCheck.reason || 'You do not have the required role to sign this step.'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
