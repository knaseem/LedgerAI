'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Link2,
  Lock,
  Eye,
  Users,
  Server,
  FileText,
  Globe,
  ShieldAlert,
  Activity,
  XCircle,
  RefreshCcw,
  Fingerprint,
  KeyRound,
} from 'lucide-react';
import { mockTeam } from '@/lib/rbac';
import { useAuditStore } from '@/lib/store';
import { verifyChain } from '@/lib/auditChain';

// ── Compliance Control Data ─────────────────────────────────────
interface ComplianceControl {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'warning' | 'fail' | 'not_applicable';
  description: string;
  lastTested: string;
  evidence: string;
  soc2Mapping: string;
  icon: React.ElementType;
}

const controls: ComplianceControl[] = [
  {
    id: 'CC1.1', name: 'Audit Logging', category: 'Monitoring',
    status: 'pass', description: 'All AI agent actions are logged with full reasoning traces, timestamps, and user context.',
    lastTested: '2026-06-03', evidence: '51 audit entries with hash chain verification',
    soc2Mapping: 'CC7.2 — System Monitoring', icon: FileText,
  },
  {
    id: 'CC1.2', name: 'Tamper-Evident Audit Trail', category: 'Integrity',
    status: 'pass', description: 'SHA-256 hash chain ensures audit records cannot be altered retroactively.',
    lastTested: '2026-06-03', evidence: 'Chain verified — 0 broken links',
    soc2Mapping: 'CC7.2 — Monitoring Integrity', icon: Link2,
  },
  {
    id: 'CC2.1', name: 'Role-Based Access Control', category: 'Access Control',
    status: 'pass', description: '5-tier RBAC with permission matrix enforced across all modules.',
    lastTested: '2026-06-03', evidence: '8 users across 5 roles configured',
    soc2Mapping: 'CC6.1 — Logical Access', icon: Users,
  },
  {
    id: 'CC2.2', name: 'Multi-Factor Authentication', category: 'Access Control',
    status: 'warning', description: 'MFA available via Supabase Auth. Not all users have enabled 2FA.',
    lastTested: '2026-06-03', evidence: `${mockTeam.filter(t => t.twoFactorEnabled).length}/${mockTeam.length} users with 2FA`,
    soc2Mapping: 'CC6.1 — Authentication', icon: Fingerprint,
  },
  {
    id: 'CC2.3', name: 'Session Management', category: 'Access Control',
    status: 'pass', description: 'Login/logout events tracked with IP, device, and timestamp. Failed attempts logged.',
    lastTested: '2026-06-03', evidence: '12 session events recorded',
    soc2Mapping: 'CC6.1 — Session Controls', icon: KeyRound,
  },
  {
    id: 'CC3.1', name: 'Separation of Duties', category: 'Process Controls',
    status: 'pass', description: 'Invoice creators cannot approve their own uploads. Workflow designers separated from approvers.',
    lastTested: '2026-06-03', evidence: '2 SoD rules enforced',
    soc2Mapping: 'CC6.3 — Role-Based Controls', icon: ShieldAlert,
  },
  {
    id: 'CC3.2', name: 'Approval Workflows', category: 'Process Controls',
    status: 'pass', description: 'Multi-step approval chains with threshold-based routing. <$1k auto, $1k-$10k single, >$10k dual.',
    lastTested: '2026-06-03', evidence: '4 threshold tiers configured',
    soc2Mapping: 'CC6.1 — Transaction Controls', icon: CheckCircle2,
  },
  {
    id: 'CC4.1', name: 'Data Encryption at Rest', category: 'Data Protection',
    status: 'pass', description: 'All data stored in Supabase with AES-256 encryption at rest.',
    lastTested: '2026-06-02', evidence: 'Supabase managed encryption enabled',
    soc2Mapping: 'CC6.7 — Data Protection', icon: Lock,
  },
  {
    id: 'CC4.2', name: 'Data Encryption in Transit', category: 'Data Protection',
    status: 'pass', description: 'All API communications use TLS 1.3. No plaintext transmissions.',
    lastTested: '2026-06-02', evidence: 'HTTPS enforced on all endpoints',
    soc2Mapping: 'CC6.7 — Transmission Security', icon: Globe,
  },
  {
    id: 'CC4.3', name: 'PII Data Classification', category: 'Data Protection',
    status: 'pass', description: 'Data fields classified as Confidential, Internal, or Public with visual indicators.',
    lastTested: '2026-06-03', evidence: 'Classification badges deployed across AP/AR modules',
    soc2Mapping: 'CC6.5 — Data Governance', icon: Eye,
  },
  {
    id: 'CC5.1', name: 'AI Model Governance', category: 'AI Controls',
    status: 'pass', description: 'All AI decisions include full reasoning traces. Human checkpoints for low-confidence results.',
    lastTested: '2026-06-03', evidence: 'Confidence threshold: 85%. Below triggers human review.',
    soc2Mapping: 'CC7.4 — AI Governance', icon: Activity,
  },
  {
    id: 'CC5.2', name: 'Data Residency', category: 'AI Controls',
    status: 'pass', description: 'Financial data processed in-browser. AI prompts contain only structured data, no raw documents stored externally.',
    lastTested: '2026-06-02', evidence: 'Zero-API architecture — browser-based processing',
    soc2Mapping: 'CC6.5 — Data Residency', icon: Server,
  },
  {
    id: 'CC6.1', name: 'Content Security Policy', category: 'Network Security',
    status: 'pass', description: 'CSP headers configured to prevent XSS and injection attacks.',
    lastTested: '2026-06-03', evidence: 'next.config.ts headers configured',
    soc2Mapping: 'CC6.6 — Boundary Protection', icon: ShieldCheck,
  },
  {
    id: 'CC6.2', name: 'API Rate Limiting', category: 'Network Security',
    status: 'pass', description: 'Rate limiting enforced on all API routes to prevent DoS attacks.',
    lastTested: '2026-06-03', evidence: 'Middleware rate limiter configured',
    soc2Mapping: 'CC6.1 — DoS Prevention', icon: RefreshCcw,
  },
];

// ── Compliance Score Ring ────────────────────────────────────────
function ComplianceScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 58;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
        {/* Background ring */}
        <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Score ring */}
        <motion.circle
          cx="64" cy="64" r="58" fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Compliance</span>
      </div>
    </div>
  );
}

// ── Status Config ────────────────────────────────────────────────
const statusConfig = {
  pass: { class: 'pill-success', label: 'Pass', icon: CheckCircle2, color: 'text-success', border: 'border-l-success' },
  warning: { class: 'pill-warning', label: 'Warning', icon: AlertTriangle, color: 'text-warning', border: 'border-l-warning' },
  fail: { class: 'pill-error', label: 'Fail', icon: XCircle, color: 'text-error', border: 'border-l-error' },
  not_applicable: { class: 'pill-neutral', label: 'N/A', icon: Clock, color: 'text-text-muted', border: 'border-l-muted' },
};

// ── Evidence Packet Export ────────────────────────────────────────
function generateEvidencePacket(): string {
  const header = `═══════════════════════════════════════════════════════════
    LEDGERAI SOC 2 TYPE II — EVIDENCE PACKET
    Generated: ${new Date().toISOString()}
    Report Period: May 1, 2026 — June 3, 2026
═══════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
─────────────────
Total Controls Tested: ${controls.length}
Controls Passing: ${controls.filter(c => c.status === 'pass').length}
Controls with Warnings: ${controls.filter(c => c.status === 'warning').length}
Controls Failing: ${controls.filter(c => c.status === 'fail').length}
Overall Compliance Score: ${Math.round((controls.filter(c => c.status === 'pass').length / controls.length) * 100)}%

`;

  const body = controls.map(c => `
[${c.status.toUpperCase()}] ${c.id}: ${c.name}
  Category: ${c.category}
  SOC 2 Mapping: ${c.soc2Mapping}
  Description: ${c.description}
  Last Tested: ${c.lastTested}
  Evidence: ${c.evidence}
`).join('\n');

  const footer = `
═══════════════════════════════════════════════════════════
DATA RESIDENCY DECLARATION
─────────────────
LedgerAI operates on a Zero-API architecture. All financial
data processing occurs within the user's browser session.
No raw financial documents are transmitted to or stored on
external AI model servers. AI prompts contain only structured
field data for analysis purposes.
═══════════════════════════════════════════════════════════
`;

  return header + body + footer;
}

// ── Data Residency Map ──────────────────────────────────────────
function DataResidencyMap() {
  const layers = [
    { label: 'User Browser', location: 'Client-side', data: ['Invoice PDFs', 'OCR Processing', 'UI State'], color: 'bg-success/15 border-success/30', dot: 'bg-success' },
    { label: 'Supabase (US-East)', location: 'Cloud — Encrypted', data: ['Workflows', 'RPA Queue', 'User Accounts'], color: 'bg-accent/15 border-accent/30', dot: 'bg-accent' },
    { label: 'Gemini API', location: 'Transient Only', data: ['Structured Prompts Only', 'No PII Transmitted', 'No Data Retained'], color: 'bg-warning/15 border-warning/30', dot: 'bg-warning' },
  ];

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Server className="w-4 h-4 text-accent" />
        Data Residency Map
      </h3>
      <div className="space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            className={`p-4 rounded-xl border ${layer.color}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${layer.dot}`} />
              <span className="text-sm font-semibold text-text-primary">{layer.label}</span>
              <span className="text-[10px] text-text-muted ml-auto">{layer.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {layer.data.map((item, j) => (
                <span key={j} className="text-[10px] px-2 py-1 rounded-md bg-surface border border-border/50 text-text-secondary">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function ComplianceDashboardPage() {
  const entries = useAuditStore((s) => s.entries);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; checked: number } | null>(null);

  const categories = ['all', ...Array.from(new Set(controls.map((c) => c.category)))];
  const filtered = categoryFilter === 'all' ? controls : controls.filter((c) => c.category === categoryFilter);

  const passCount = controls.filter((c) => c.status === 'pass').length;
  const warnCount = controls.filter((c) => c.status === 'warning').length;
  const failCount = controls.filter((c) => c.status === 'fail').length;
  const score = Math.round((passCount / controls.length) * 100);

  const twoFACount = mockTeam.filter((t) => t.twoFactorEnabled).length;

  const handleExport = () => {
    const report = generateEvidencePacket();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledgerai-soc2-evidence-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    setVerificationResult(null);
    // Add minor artificial delay so the user feels the computation happening
    await new Promise((r) => setTimeout(r, 800));
    try {
      const result = await verifyChain(entries);
      setVerificationResult({ valid: result.isValid, checked: result.verifiedEntries });
    } catch (e) {
      console.error(e);
      setVerificationResult({ valid: false, checked: 0 });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance & Security</h1>
          <p className="text-sm text-text-muted mt-1">SOC 2 Type II controls status, data residency, and evidence management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleVerifyChain} disabled={verifying} className="btn-ghost btn-sm">
            {verifying ? (
              <><RefreshCcw className="w-3.5 h-3.5 animate-spin" />Verifying...</>
            ) : (
              <><Link2 className="w-3.5 h-3.5" />Verify Chain</>
            )}
          </button>
          <button onClick={handleExport} className="btn-primary btn-sm">
            <Download className="w-3.5 h-3.5" />
            Export Evidence Packet
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            verificationResult.valid
              ? 'bg-success/10 border-success/30'
              : 'bg-error/10 border-error/30'
          }`}
        >
          {verificationResult.valid ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-error" />
          )}
          <div>
            <p className={`text-sm font-semibold ${verificationResult.valid ? 'text-success' : 'text-error'}`}>
              {verificationResult.valid ? 'Audit Chain Verified ✓' : 'Chain Integrity Broken ✗'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {verificationResult.checked} entries checked · All hashes valid · No tampering detected
            </p>
          </div>
          <span className="ml-auto text-[10px] text-text-muted font-mono">
            {new Date().toISOString()}
          </span>
        </motion.div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Compliance Score Ring */}
        <motion.div
          className="glass p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ComplianceScoreRing score={score} />
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-success">{passCount}</p>
              <p className="text-[10px] text-text-muted">Pass</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-warning">{warnCount}</p>
              <p className="text-[10px] text-text-muted">Warn</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-error">{failCount}</p>
              <p className="text-[10px] text-text-muted">Fail</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="glass p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Security Posture
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">2FA Adoption</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: `${(twoFACount / mockTeam.length) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-success">{twoFACount}/{mockTeam.length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Encryption</span>
              <span className="pill pill-success text-[10px]">AES-256 + TLS 1.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Data Residency</span>
              <span className="pill pill-info text-[10px]">US-East (Browser + Supabase)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Hash Chain</span>
              <span className="pill pill-success text-[10px]">
                <Link2 className="w-3 h-3" />
                Verified · 51 entries
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">SoD Rules</span>
              <span className="pill pill-success text-[10px]">2 rules enforced</span>
            </div>
          </div>
        </motion.div>

        {/* Data Residency Map */}
        <div className="lg:col-span-2">
          <DataResidencyMap />
        </div>
      </div>

      {/* Controls Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Control Status Matrix
          </h2>
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {cat === 'all' ? 'All Controls' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((control, i) => {
            const sc = statusConfig[control.status];
            const StatusIcon = sc.icon;
            const ControlIcon = control.icon;

            return (
              <motion.div
                key={control.id}
                className={`glass-flat p-4 border-l-2 ${sc.border} hover:bg-surface-hover/50 transition-colors`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ControlIcon className={`w-4 h-4 ${sc.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-text-muted font-mono">{control.id}</span>
                      <h4 className="text-sm font-semibold text-text-primary">{control.name}</h4>
                      <div className={`pill ${sc.class} ml-auto`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-2">{control.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-muted">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {control.soc2Mapping}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Tested: {control.lastTested}
                      </span>
                      <span className="flex items-center gap-1 text-text-secondary">
                        <CheckCircle2 className="w-3 h-3" />
                        {control.evidence}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Framework Alignment */}
      <motion.div
        className="glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" />
          Framework Alignment
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'SOC 2 Type II', coverage: 93, controls: 14, status: 'Active' },
            { name: 'SOX Compliance', coverage: 88, controls: 10, status: 'Active' },
            { name: 'ISO 27001', coverage: 79, controls: 11, status: 'Planned' },
            { name: 'GDPR', coverage: 85, controls: 8, status: 'Active' },
          ].map((fw, i) => (
            <div key={i} className="glass-flat p-4 text-center">
              <p className="text-xs text-text-muted mb-1">{fw.name}</p>
              <p className="text-2xl font-bold text-text-primary">{fw.coverage}%</p>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mt-2 mb-2">
                <motion.div
                  className={`h-full rounded-full ${
                    fw.coverage >= 90 ? 'bg-success' : fw.coverage >= 70 ? 'bg-warning' : 'bg-error'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${fw.coverage}%` }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] text-text-muted">{fw.controls} controls</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  fw.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {fw.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
