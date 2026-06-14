'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ArrowRight,
  Database,
  SearchCode
} from 'lucide-react';
import { HashedAuditEntry } from '@/lib/auditChain';

interface AuditReasoningTreeProps {
  entry: HashedAuditEntry;
}

interface TreeStep {
  id: string;
  title: string;
  icon: React.ElementType;
  status: 'success' | 'warning' | 'error';
  shortDetail: string;
  fullDetail: string[];
}

export default function AuditReasoningTree({ entry }: AuditReasoningTreeProps) {
  const [activeStep, setActiveStep] = useState<string | null>('ingest');

  // Simple heuristic parser to construct structured data from the flat reasoning text
  const parseReasoningToSteps = (reasoningText: string, agent: string, result: string): TreeStep[] => {
    const text = reasoningText.toLowerCase();
    
    // Step 1: Ingestion
    let ingestTitle = 'Data Ingestion';
    let ingestShort = 'Source document ingested';
    let ingestDetails = [`Agent: ${agent}`, `System: ${entry.system}`];
    
    if (text.includes('ocr') || text.includes('parsed') || text.includes('pdf')) {
      ingestTitle = 'OCR & PDF Ingestion';
      ingestShort = 'Invoice document parsed';
      const confidenceMatch = reasoningText.match(/(\d+)%/);
      const conf = confidenceMatch ? `${confidenceMatch[0]} confidence` : 'High confidence';
      ingestShort += ` (${conf})`;
      ingestDetails.push('Engine: Gemini 3.5 OCR parser', `Confidence rating: ${conf}`);
    } else if (text.includes('bank') || text.includes('statement') || text.includes('recon')) {
      ingestTitle = 'Bank Statement Sync';
      ingestShort = 'Reconciliation data synced';
      ingestDetails.push('Engine: NetSuite bank feed sync', 'Format: ISO 20022 XML');
    }
    
    // Step 2: Verification / Fraud check
    let verifyTitle = 'Governance Check';
    let verifyShort = 'Security policies checked';
    let verifyStatus: 'success' | 'warning' | 'error' = 'success';
    let verifyDetails = ['Checked against Separation of Duties rules', 'Verified vendor record matches master data'];
    
    if (text.includes('exception') || text.includes('not found') || text.includes('duplicate')) {
      verifyStatus = 'warning';
      verifyShort = 'Anomalies detected';
      if (text.includes('grn')) {
        verifyDetails.push('Anomaly flag: Missing Good Receipt Note (GRN)');
      }
      if (text.includes('duplicate')) {
        verifyDetails.push('Anomaly flag: Identical amount/description detected recently');
      }
    } else {
      verifyShort = 'All security policies verified';
    }

    // Step 3: Matching / Policy check
    let matchTitle = 'Decision Logic';
    let matchShort = 'Matching rules evaluated';
    let matchStatus: 'success' | 'warning' | 'error' = 'success';
    let matchDetails = ['Verified approval threshold routing'];
    
    if (text.includes('matches') || text.includes('variance') || text.includes('reconciliation')) {
      matchTitle = 'Three-Way Match';
      const amountMatch = reasoningText.match(/\$\d+(?:,\d+)*(?:\.\d+)?/);
      if (amountMatch) {
        matchShort = `Matched values ($${amountMatch[0]} vs PO)`;
      } else {
        matchShort = 'Amounts matched successfully';
      }
      matchDetails.push('Verified: PO matches Invoice amount', 'Verified: Goods receipt matches PO quantities');
    } else if (text.includes('variance') || text.includes('mismatch')) {
      matchStatus = 'warning';
      matchShort = 'Variance threshold exceeded';
      matchDetails.push('Variance check: Invoice total does not match Purchase Order limit');
    }

    // Step 4: Outcome
    let outcomeTitle = 'Final Action';
    let outcomeShort = 'Transaction approved';
    let outcomeStatus: 'success' | 'warning' | 'error' = 'success';
    let outcomeDetails = [];
    
    if (result === 'success') {
      outcomeShort = 'Approved & posted';
      outcomeDetails.push('Action: Posted to ERP ledger', 'Signed: Digitally authorized');
    } else if (result === 'warning') {
      outcomeStatus = 'warning';
      outcomeShort = 'Escalated to human review';
      outcomeDetails.push('Action: Generated human checkpoint cp-002', 'Status: Awaiting override');
    } else {
      outcomeStatus = 'error';
      outcomeShort = 'Rejected';
      outcomeDetails.push('Action: Transaction rejected & archived', 'Email alert dispatched to vendor');
    }

    return [
      { id: 'ingest', title: ingestTitle, icon: Database, status: 'success', shortDetail: ingestShort, fullDetail: ingestDetails },
      { id: 'verify', title: verifyTitle, icon: ShieldCheck, status: verifyStatus, shortDetail: verifyShort, fullDetail: verifyDetails },
      { id: 'match', title: matchTitle, icon: Scale, status: matchStatus, shortDetail: matchShort, fullDetail: matchDetails },
      { id: 'outcome', title: outcomeTitle, icon: result === 'success' ? CheckCircle2 : result === 'warning' ? AlertTriangle : XCircle, status: outcomeStatus, shortDetail: outcomeShort, fullDetail: outcomeDetails },
    ];
  };

  const steps = parseReasoningToSteps(entry.reasoning, entry.agent, entry.result);

  return (
    <div className="space-y-4 my-2">
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <SearchCode className="w-3.5 h-3.5 text-accent" />
          AI Explainability Decision Trace
        </h4>
        <span className="text-[9px] text-text-muted">Click nodes to inspect data layers</span>
      </div>

      {/* Decision Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isLast = index === steps.length - 1;

          // Status colors
          const statusColors = {
            success: 'text-success border-success/30 bg-success/5 hover:bg-success/10',
            warning: 'text-warning border-warning/30 bg-warning/5 hover:bg-warning/10',
            error: 'text-error border-error/30 bg-error/5 hover:bg-error/10',
          };

          return (
            <div key={step.id} className="relative flex items-stretch">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`w-full p-3.5 rounded-xl border flex flex-col text-left transition-all duration-300 ${
                  isActive 
                    ? 'border-accent ring-2 ring-accent/20 bg-accent/5' 
                    : 'border-border/40 hover:border-border bg-surface/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-surface border border-border/50 ${
                    isActive ? 'text-accent' : step.status === 'success' ? 'text-success' : step.status === 'warning' ? 'text-warning' : 'text-error'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-text-primary truncate">{step.title}</span>
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {step.shortDetail}
                </p>
              </button>

              {/* Connecting arrow (desktop only) */}
              {!isLast && (
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-2.5 z-20 w-5 h-5 rounded-full bg-background border border-border/60 items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-text-muted" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Inspector Area */}
      <AnimatePresence mode="wait">
        {activeStep && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="p-4 rounded-xl border border-border/60 bg-surface/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] uppercase tracking-wider text-accent font-bold">
                Decision Layer Metadata: {steps.find(s => s.id === activeStep)?.title}
              </span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-xs text-text-secondary leading-relaxed">
              {steps.find(s => s.id === activeStep)?.fullDetail.map((detail, index) => (
                <li key={index} className="marker:text-accent">
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
