'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  ArrowUpDown,
  ChevronRight,
  Zap,
  Eye,
  RefreshCcw,
  X,
} from 'lucide-react';
import { useInvoiceStore, useCheckpointStore } from '@/lib/store';
import type { Invoice } from '@/lib/mockData';

// ── Status Config ────────────────────────────────────────────────
const statusConfig: Record<Invoice['status'], { class: string; icon: React.ElementType; label: string }> = {
  matched: { class: 'pill-success', icon: CheckCircle2, label: 'Matched' },
  approved: { class: 'pill-info', icon: CheckCircle2, label: 'Approved' },
  pending: { class: 'pill-neutral', icon: Clock, label: 'Pending' },
  exception: { class: 'pill-warning', icon: AlertTriangle, label: 'Exception' },
  rejected: { class: 'pill-error', icon: XCircle, label: 'Rejected' },
};

// ── Upload Zone ──────────────────────────────────────────────────
function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const addInvoice = useInvoiceStore((s) => s.addInvoice);
  const addCheckpoint = useCheckpointStore((s: any) => s.addCheckpoint);

  const uploadInvoice = async (file: File) => {
    setDragging(false);
    setUploaded(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData, mimeType: file.type })
        });
        
        if (!response.ok) {
          console.error("OCR API Error");
          setUploaded(false);
          return;
        }
        
        const extractedData = await response.json();
        const generatedId = `INV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        
        const newInvoice: Invoice = {
          id: generatedId,
          vendor: extractedData.vendor || file.name.split('.')[0] || 'Unknown Vendor',
          amount: extractedData.amount || 0,
          date: extractedData.date || new Date().toISOString().split('T')[0],
          dueDate: extractedData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'exception', // Force exception for Human Checkpoint!
          poNumber: extractedData.poNumber || `PO-${Math.floor(Math.random() * 10000)}`,
          grnMatch: Math.random() > 0.5,
          confidence: 0.82, // Artificial low confidence to trigger fallback
          lineItems: extractedData.lineItems || [],
          currency: extractedData.currency || 'USD'
        };
        
        addInvoice(newInvoice);
        
        // --- RPA FALLBACK TRIGGER ---
        // Create a human checkpoint for the newly uploaded invoice
        addCheckpoint({
          id: `CP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          invoiceId: generatedId,
          vendor: newInvoice.vendor,
          amount: newInvoice.amount,
          reason: 'AI OCR Confidence < 85%. Missing visual GRN validation.',
          recommendation: 'Please manually review the extracted vendor and amount against the uploaded document.',
          timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
        });

        setUploaded(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setUploaded(false);
      alert('Failed to process invoice.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadInvoice(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadInvoice(e.target.files[0]);
    }
  };

  return (
    <div
      className={`drop-zone p-8 text-center transition-all cursor-pointer ${dragging ? 'active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg" 
        onChange={handleFileSelect} 
      />
      {uploaded ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
          <CheckCircle2 className="w-10 h-10 text-success" />
          <p className="text-sm font-medium text-success">Invoice uploaded — AI extracting fields...</p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Drop invoice PDF here</p>
            <p className="text-xs text-text-muted mt-1">or click to browse · PDF, PNG, JPG up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Agent Step Feed ──────────────────────────────────────────────
function AgentStepFeed() {
  const steps = [
    { label: 'Invoice Ingestion', status: 'complete' as const, detail: '20 invoices processed' },
    { label: 'Field Extraction', status: 'complete' as const, detail: 'AI confidence: 96.8%' },
    { label: 'Three-Way Matching', status: 'active' as const, detail: 'Matching PO + GRN...' },
    { label: 'Audit & Approve', status: 'pending' as const, detail: 'Awaiting match results' },
  ];

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-accent" />
        Agent Pipeline
      </h3>
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 text-xs ${
              step.status === 'complete' ? 'bg-success/10 text-success' :
              step.status === 'active' ? 'bg-accent/10 text-accent animate-pulse' :
              'bg-surface text-text-muted'
            }`}>
              {step.status === 'complete' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
               step.status === 'active' ? <Zap className="w-3.5 h-3.5" /> :
               <Clock className="w-3.5 h-3.5" />}
              <div>
                <p className="font-medium">{step.label}</p>
                <p className="opacity-70 text-[10px]">{step.detail}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-text-muted/30 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invoice Drawer ───────────────────────────────────────────────
function InvoiceDrawer({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const updateStatus = useInvoiceStore((s) => s.updateInvoiceStatus);
  const sc = statusConfig[invoice.status];
  const StatusIcon = sc.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* Drawer */}
        <motion.div
          className="relative bg-background/95 backdrop-blur-xl border-l border-border w-[480px] h-full overflow-y-auto shadow-2xl"
          style={{ borderRadius: '16px 0 0 16px' }}
          initial={{ x: 480 }}
          animate={{ x: 0 }}
          exit={{ x: 480 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface/50 border-b border-border/50 px-6 py-4 flex items-center justify-between z-10" style={{ borderRadius: '16px 0 0 0' }}>
            <div>
              <h3 className="text-lg font-bold">{invoice.vendor}</h3>
              <p className="text-xs text-text-muted font-mono">{invoice.id}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status & Amount */}
            <div className="flex items-center justify-between">
              <div className={`pill ${sc.class}`}>
                <StatusIcon className="w-3 h-3" />
                {sc.label}
              </div>
              <p className="text-2xl font-bold font-mono">${invoice.amount.toLocaleString()}</p>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'PO Number', value: invoice.poNumber },
                { label: 'Currency', value: invoice.currency },
                { label: 'Invoice Date', value: invoice.date },
                { label: 'Due Date', value: invoice.dueDate },
                { label: 'GRN Match', value: invoice.grnMatch ? 'Yes' : 'No' },
                { label: 'Confidence', value: `${(invoice.confidence * 100).toFixed(0)}%` },
              ].map((f) => (
                <div key={f.label} className="bg-surface border border-border/50 p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">{f.label}</p>
                  <p className="text-sm font-medium mt-1 font-mono">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Line Items */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Line Items</h4>
              <div className="space-y-2">
                {invoice.lineItems.map((item, i) => (
                  <div key={i} className="bg-surface border border-border/50 p-3 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-sm text-text-primary">{item.description}</p>
                      <p className="text-xs text-text-muted mt-0.5">Qty: {item.qty} × ${item.unitPrice.toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-mono font-medium">${item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="glass-flat p-4 border-l-2 border-warning">
                <p className="text-xs uppercase tracking-wider text-warning mb-1">Exception Note</p>
                <p className="text-sm text-text-secondary">{invoice.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { updateStatus(invoice.id, 'approved'); onClose(); }}
                className="btn-primary flex-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => { updateStatus(invoice.id, 'rejected'); onClose(); }}
                className="btn-ghost flex-1 border-error/30 text-error hover:bg-error/10"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Checkpoint Panel ─────────────────────────────────────────────
function CheckpointPanel() {
  const checkpoints = useCheckpointStore((s) => s.checkpoints);
  const resolve = useCheckpointStore((s) => s.resolveCheckpoint);

  if (checkpoints.length === 0) return null;

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        Human Checkpoints
        <span className="pill pill-warning ml-auto">{checkpoints.length}</span>
      </h3>
      <div className="space-y-3">
        {checkpoints.map((cp) => (
          <div key={cp.id} className="glass-flat p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold">{cp.vendor}</p>
                <p className="text-xs text-text-muted font-mono">{cp.invoiceId} · ${cp.amount.toLocaleString()}</p>
              </div>
              <span className="text-[10px] text-text-muted">{cp.timestamp}</span>
            </div>
            <p className="text-xs text-warning mb-2">{cp.reason}</p>
            <div className="glass-flat p-3 mb-3 border-l-2 border-accent">
              <p className="text-[10px] uppercase tracking-wider text-accent mb-1">LedgerAI Recommendation</p>
              <p className="text-xs text-text-secondary">{cp.recommendation}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => resolve(cp.id)} className="btn-primary btn-sm flex-1">Approve</button>
              <button onClick={() => resolve(cp.id)} className="btn-ghost btn-sm flex-1">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Accounts Payable Page ────────────────────────────────────────
export default function AccountsPayablePage() {
  const invoices = useInvoiceStore((s) => s.invoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'amount' | 'date' | 'vendor'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const filtered = invoices
    .filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (search && !inv.vendor.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'amount') return (a.amount - b.amount) * dir;
      if (sortField === 'vendor') return a.vendor.localeCompare(b.vendor) * dir;
      return a.date.localeCompare(b.date) * dir;
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounts Payable</h1>
        <p className="text-sm text-text-muted mt-1">Manage invoices, three-way matching, and approvals.</p>
      </div>

      {/* Agent Pipeline */}
      <AgentStepFeed />

      {/* Upload */}
      <UploadZone />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="w-full pl-10 pr-4 py-2.5 glass-flat text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          {['all', 'matched', 'pending', 'exception', 'approved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th className="cursor-pointer" onClick={() => toggleSort('vendor')}>
                    <span className="flex items-center gap-1">Vendor <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="cursor-pointer" onClick={() => toggleSort('amount')}>
                    <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th>PO #</th>
                  <th>GRN</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const sc = statusConfig[inv.status];
                  const Icon = sc.icon;
                  return (
                    <motion.tr
                      key={inv.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedInvoice(inv)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td className="font-mono text-xs">{inv.id}</td>
                      <td className="font-medium">{inv.vendor}</td>
                      <td className="font-mono">${inv.amount.toLocaleString()}</td>
                      <td className="font-mono text-xs">{inv.poNumber}</td>
                      <td>
                        {inv.grnMatch ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-error" />
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`pill ${sc.class}`}>
                            <Icon className="w-3 h-3" />
                            {sc.label}
                          </div>
                          {inv.status === 'approved' && (
                            <button 
                              className="btn-ghost btn-sm text-xs px-2 py-1 ml-2 text-accent border border-accent/20 bg-accent/5 hover:bg-accent/15 flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSyncToast(`LedgerAI Extension: Syncing Invoice ${inv.id} to NetSuite ERP via browser session...`);
                                setTimeout(() => setSyncToast(null), 4000);
                              }}
                            >
                              <RefreshCcw className="w-3 h-3" />
                              Sync to ERP
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <Eye className="w-4 h-4 text-text-muted" />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checkpoint Panel */}
        <div className="lg:col-span-1">
          <CheckpointPanel />
        </div>
      </div>

      {/* Invoice Drawer */}
      {selectedInvoice && (
        <InvoiceDrawer
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Mock Chrome Extension Toast */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 bg-surface/95 backdrop-blur-md border border-accent/30 shadow-2xl px-5 py-3 rounded-full"
          >
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
              <Zap className="w-3 h-3 text-accent" />
            </div>
            <span className="text-sm font-medium text-white">{syncToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
